import type { Request, Response } from "express";
import ErrorLogs from "../models/Error_Logs.js";
import { analyzeErrorWithGemini } from "../services/ai.service.js";
import pool from "../config/db.js";
import crypto from "crypto";
import { io } from "../lib/socket.js";
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

      io.emit("error_status_changed", {
        id: result.error_group_id,
        ai_status: "pending",
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
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
      const data = await this.errorLogs.getAllErrors(page, limit);
      res.status(200).json(data);
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
      io.emit("error_status_changed", {
        id,
        ai_status: "pending",
      });
      res.status(200).json({ message: "Retry analysis started background" });

      this.handleAiAnalysis(
        id,
        data.error_message,
        data.stack_trace,
        "English",
        data,
      );
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
    language = "English",
    previousData?: any,
  ) => {
    let aiResult: any;
    try {
      io.to(errorGroupId).emit("ai_start");

      aiResult = await analyzeErrorWithGemini(
        errorMessage,
        stackTrace,
        language,
      );

      if (aiResult.ai_status !== "success") {
        throw new Error(
          `AI analysis returned non-success status: ${aiResult.ai_status}`,
        );
      }

      await this.streamText(
        errorGroupId,
        "ai_reason_chunk",
        aiResult.ai_reason,
      );
      await this.streamText(
        errorGroupId,
        "ai_suggestion_chunk",
        aiResult.ai_suggestion,
      );

      await this.errorLogs.updateErrorGroupAI(
        errorGroupId,
        aiResult.ai_status,
        aiResult.ai_reason,
        aiResult.ai_suggestion,
        aiResult.error_location?.file_path,
        aiResult.error_location?.line,
        aiResult.error_location?.raw_line_text,
      );
      io.emit("error_status_changed", {
        id: errorGroupId,
        ai_status: aiResult.ai_status,
      });
    } catch (error: any) {
      console.error(error);

      await pool.query(
        `UPDATE error_groups SET ai_status='failed' WHERE id=$1`,
        [errorGroupId],
      );

      io.to(errorGroupId).emit("ai_error", {
        ai_status: "failed",
        previous_result: previousData
          ? {
              ai_reason: previousData.ai_reason,
              ai_suggestion: previousData.ai_suggestion,
              file_path: previousData.file_path,
              line: previousData.line,
              raw_line_text: previousData.raw_line_text,
            }
          : null,
      });
      io.emit("error_status_changed", {
        id: errorGroupId,
        ai_status: "failed",
      });
      return;
    }
    try {
      io.to(errorGroupId).emit("ai_complete", {
        ai_status: aiResult.ai_status,
        file_path: aiResult.error_location?.file_path,
        line: aiResult.error_location?.line,
        raw_line_text: aiResult.error_location?.raw_line_text,
      });
    } catch (emitError) {
      console.error(
        "Emit ai_complete failed, but DB is already correct:",
        emitError,
      );
    }
  };
  private async streamText(
    roomId: string,
    event: string,
    text?: string,
    chunkSize = 40,
    delay = 25,
  ) {
    if (!text) return;

    for (let i = 0; i < text.length; i += chunkSize) {
      io.to(roomId).emit(event, {
        chunk: text.slice(i, i + chunkSize),
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
export default LogsController;
