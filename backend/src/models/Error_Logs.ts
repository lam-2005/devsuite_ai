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
}
export default ErrorLogs;
