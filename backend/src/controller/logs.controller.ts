import type { Request, Response } from "express";
import ErrorLogs from "../models/Error_Logs.js";
import { analyzeErrorWithGemini } from "../services/ai.service.js";
import pool from "../config/db.js";

class LogsController {
  private errorLogs: ErrorLogs;
  constructor() {
    this.errorLogs = new ErrorLogs();
  }
  createLog = async (req: Request, res: Response) => {
    const { project_id, error_message, stack_trace } = req.body;
    if (!project_id || !error_message || !stack_trace) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const result = await this.errorLogs.createErrorLog(
        project_id,
        error_message,
        stack_trace,
      );
      res.status(201).json({
        message: "Error log created successfully",
        data: result,
      });

      console.log("⏳ Khởi chạy phân tích Gemini ngầm cho log ID:", result.id);

      // 2. Gọi hàm ngầm
      analyzeErrorWithGemini(error_message, stack_trace, "English")
        .then(async (data) => {
          console.log("Analyze successfully", data);

          await this.errorLogs.updateErrorLog(
            result.id,
            data.ai_status,
            data.ai_reason,
            data.ai_suggestion,
            data.error_fingerprint,
          );
        })
        .catch(async (error) => {
          console.error("Analyze failed", error.message);
          const failSql = `
          UPDATE error_logs 
          SET ai_status = 'failed' 
          WHERE id = $1
        `;
          await pool.query(failSql, [result.id]);
          console.log(
            `📌 Đã cập nhật trạng thái 'failed' cho log ID: ${result.id}`,
          );
        });
    } catch (error: unknown) {
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
    }
  };
}
export default LogsController;
