import pool from "../config/db.js";

class ErrorLogs {
  createErrorLog = async (
    project_id: string,
    error_message: string,
    stack_trace: string,
    error_fingerprint: string,
  ) => {
    const groupQuery = `
      insert into error_groups (error_fingerprint) values ($1)
      on conflict (error_fingerprint) do update set error_count = error_groups.error_count + 1, updated_at = now()
      returning id, ai_status, ai_reason, ai_suggestion, file_path, line, raw_line_text;
    `;
    const groupResult = await pool.query(groupQuery, [error_fingerprint]);
    const error_group_id = groupResult.rows[0].id;
    const current_ai_status = groupResult.rows[0].ai_status;
    const ai_reason = groupResult.rows[0].ai_reason;
    const ai_suggestion = groupResult.rows[0].ai_suggestion;
    const file_path = groupResult.rows[0].file_path;
    const line = groupResult.rows[0].line;
    const raw_line_text = groupResult.rows[0].raw_line_text;

    const logQuery = `
      insert into error_logs (project_id, error_group_id, error_message, stack_trace) values ($1, $2, $3, $4)
      returning id, status, created_at;
    `;
    const logValues = [project_id, error_group_id, error_message, stack_trace];
    const { rows } = await pool.query(logQuery, logValues);

    return {
      id: rows[0].id,
      project_id,
      error_group_id,
      error_message,
      stack_trace,
      status: rows[0].status,
      ai_status: current_ai_status,
      ai_reason,
      ai_suggestion,
      file_path,
      line,
      raw_line_text,
      created_at: rows[0].created_at,
    };
  };

  updateErrorGroupAI = async (
    error_group_id: string,
    ai_status: "success" | "failed",
    ai_reason: string,
    ai_suggestion: string,
    file_path: string,
    line: number,
    raw_line_text: string,
  ) => {
    const query = `
      update error_groups set ai_status = $1, ai_reason = $2, ai_suggestion = $3, file_path = $4, line = $5, raw_line_text = $6, updated_at = now() 
      where id = $7
      returning id, ai_status, ai_reason, ai_suggestion;
    `;
    const values = [
      ai_status,
      ai_reason,
      ai_suggestion,
      file_path,
      line,
      raw_line_text,
      error_group_id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };

  getAllErrors = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;

    const query = `
    SELECT 
      eg.id AS error_group_id,
      eg.error_count,
      eg.ai_status,
      p.id AS project_id,
      p.name AS project_name,
      p.environment,
      el.error_message,
      el.created_at AS last_seen
    FROM error_groups eg
    LEFT JOIN (
        SELECT DISTINCT ON (error_group_id)
            error_group_id,
            error_message,
            created_at,
            project_id
        FROM error_logs
        ORDER BY error_group_id, created_at DESC
    ) el ON el.error_group_id = eg.id
    LEFT JOIN projects p ON el.project_id = p.id
    ORDER BY el.created_at DESC NULLS LAST
    LIMIT $1 OFFSET $2;`;

    const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM error_groups;
  `;
    const [{ rows }, { rows: countRows }] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);

    const total = countRows[0].total;

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getByFingerprint = async (id: string) => {
    const query = `
     SELECT
         eg.id AS error_group_id,
          eg.error_fingerprint,
          eg.error_count,
          eg.ai_status,
          eg.ai_reason,
          eg.ai_suggestion,
          eg.line,
          eg.file_path,
          eg.raw_line_text,

          el.error_message,
          el.stack_trace,
          el.project_id,
        el.created_at AS last_seen,

          p.id AS project_id,
          p.project_name,
          p.environment
    FROM error_groups eg 
    JOIN (
        SELECT
            project_id,
            error_group_id,
            error_message,
            stack_trace,created_at
        FROM error_logs
        WHERE error_group_id = $1 
        ORDER BY created_at DESC
        LIMIT 1
    ) el ON el.error_group_id = eg.id
    JOIN (SELECT id, name AS project_name, environment from projects) p ON el.project_id = p.id
    where eg.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  };
}
export default ErrorLogs;
