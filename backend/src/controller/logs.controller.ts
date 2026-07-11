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
        analyzeErrorWithGemini(error_message, stack_trace, "English")
          .then(async (data) => {
            console.log("Analyze successfully", data);

            try {
              await this.errorLogs.updateErrorGroupAI(
                result.error_group_id,
                data.ai_status,
                data.ai_reason,
                data.ai_suggestion,
              );

              io.to(result.error_group_id).emit("get_error_log", {
                error_group_id: result.error_group_id,
                ai_status: data.ai_status,
                ai_reason: data.ai_reason,
                ai_suggestion: data.ai_suggestion,
              });
            } catch (error) {
              console.error(error);
            }
          })
          .catch(async (error) => {
            console.error("Analyze failed", error.message);
            const failSql = `
            UPDATE error_groups
            SET status = 'failed' 
            WHERE id = $1
        `;
            await pool.query(failSql, [result.error_group_id]);
            console.log(
              `Error group ID updated 'failed': ${result.error_group_id}`,
            );
          });
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
  getErrorByFingerprint = async (req: Request, res: Response) => {};
  retry = async (req: Request, res: Response) => {};
}
export default LogsController;
