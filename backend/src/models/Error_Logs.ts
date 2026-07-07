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
      returning id, status, ai_reason, ai_suggestion;
    `;
    const groupResult = await pool.query(groupQuery, [error_fingerprint]);
    const error_group_id = groupResult.rows[0].id;
    const current_ai_status = groupResult.rows[0].status;
    const ai_reason = groupResult.rows[0].ai_reason;
    const ai_suggestion = groupResult.rows[0].ai_suggestion;

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
      created_at: rows[0].created_at,
    };
  };

  updateErrorGroupAI = async (
    error_group_id: string,
    ai_status: "success" | "failed",
    ai_reason: string,
    ai_suggestion: string,
  ) => {
    const query = `
      update error_groups set status = $1, ai_reason = $2, ai_suggestion = $3, updated_at = now() 
      where id = $4
      returning id, status, ai_reason, ai_suggestion;
    `;
    const values = [ai_status, ai_reason, ai_suggestion, error_group_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };
}
export default ErrorLogs;
