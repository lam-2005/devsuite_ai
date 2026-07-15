import type { Request, Response } from "express";
import ErrorLogs from "../models/Error_Logs.js";
import { analyzeErrorWithGemini } from "../services/ai.service.js";
import pool from "../config/db.js";
import crypto from "crypto";
import { io } from "../lib/socket.js";
import LogsService from "../services/logs.service.js";
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

    const combinedText = `${error_message}\n${stack_trace}`;

    const error_fingerprint = crypto
      .createHash("md5")
      .update(combinedText)
      .digest("hex");

    try {
      const result = await this.errorLogs.createErrorLog(
        project_id,
        error_message,
        stack_trace,
        error_fingerprint,
      );
      res.status(201).json({
        message: "Error log created successfully",
        data: result,
      });

      console.log("Khởi chạy phân tích Gemini ngầm cho log ID:", result.id);
      if (result.ai_status === "pending" || result.ai_status === "failed") {
        // 2. Gọi hàm ngầm
        try {
          void this.handleAiAnalysis(
            result.error_group_id,
            error_message,
            stack_trace,
          );
        } catch (error) {
          console.error(
            `Error group ID updated 'failed': ${result.error_group_id}`,
          );
        }
      } else {
        console.log("Analyze successfully");
      }
    } catch (error: unknown) {
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
    }
  };

  getErrors = async (req: Request, res: Response) => {
    try {
      const data = await this.errorLogs.getAllErrors();
      res.status(200).json({
        data,
      });
    } catch (error: unknown) {
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
    }
  };

  getErrorByFingerprint = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      console.error("id is incorrect");
      return res.status(400).json({ error_message: "id is incorrect" });
    }
    try {
      const data = await this.errorLogs.getByFingerprint(id);
      res.status(200).json({ data });
    } catch (error: unknown) {
      console.log(error);

      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
    }
  };

  retry = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      console.error("Id is incorrect");
      return res.status(400).json({ error_message: "id is incorrect" });
    }
    try {
      const data = await this.errorLogs.getByFingerprint(id);
      if (!data) {
        return res.status(404).json({ error_message: "Error group not found" });
      }

      const setPendingSql = `UPDATE error_groups SET ai_status = 'pending' WHERE id = $1;`;
      await pool.query(setPendingSql, [id]);

      res.status(200).json({ message: "Retry analysis started background" });

      this.handleAiAnalysis(id, data.error_message, data.stack_trace);
    } catch (error: unknown) {
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
    }
  };

  private handleAiAnalysis = async (
    errorGroupId: string,
    errorMessage: string,
    stackTrace: string,
    language: string = "English",
  ) => {
    try {
      // 1. Gọi AI phân tích
      const aiResult = await analyzeErrorWithGemini(
        errorMessage,
        stackTrace,
        language,
      );
      console.log("Analyze successfully", aiResult);

      // 2. Cập nhật kết quả thành công vào DB
      await this.errorLogs.updateErrorGroupAI(
        errorGroupId,
        aiResult.ai_status,
        aiResult.ai_reason,
        aiResult.ai_suggestion,
        aiResult.error_location?.file_path,
        aiResult.error_location?.line,
        aiResult.error_location?.raw_line_text,
      );

      // 3. Bắn Realtime qua Socket.io sang Frontend
      io.to(errorGroupId).emit("get_error_log", {
        error_group_id: errorGroupId,
        ai_status: aiResult.ai_status,
        ai_reason: aiResult.ai_reason,
        ai_suggestion: aiResult.ai_suggestion,
        file_path: aiResult.error_location.file_path,
        line: aiResult.error_location.line,
        raw_line_text: aiResult.error_location.raw_line_text,
      });
    } catch (error: any) {
      console.error("Analyze failed", error.message);

      // 4. Lỗi thì UPDATE trường ai_status thành 'failed'
      const failSql = `
      UPDATE error_groups 
      SET ai_status = 'failed' 
      WHERE id = $1;
    `;
      await pool.query(failSql, [errorGroupId]);

      // Bắn tin realtime báo thất bại để UI tắt loading
      io.to(errorGroupId).emit("get_error_log", {
        error_group_id: errorGroupId,
        ai_status: "failed",
      });
    }
  };
}
export default LogsController;
