import pool from "../config/db.js";

class ErrorLogs {
  createErrorLog = async (
    project_id: string,
    error_message: string,
    stack_trace: string,
  ) => {
    const query = `Insert into error_logs (project_id, error_message, stack_trace) values ($1, $2, $3) RETURNING id, ai_status, status, created_at`;
    const values = [project_id, error_message, stack_trace];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };

  updateErrorLog = async (
    log_id: string,
    ai_status: string,
    ai_reason: string,
    ai_suggestion: string,
    error_fingerprint: string | null,
  ) => {
    const query = `UPDATE error_logs SET error_fingerprint = $1, ai_reason = $2, ai_suggestion = $3, ai_status = $4 WHERE id = $5`;
    const values = [
      error_fingerprint,
      ai_reason,
      ai_suggestion,
      ai_status,
      log_id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  };
}
export default ErrorLogs;
