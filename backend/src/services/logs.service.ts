import ErrorLogs from "../models/Error_Logs.js";
import crypto from "crypto";
class LogsService {
  private errorLogsModel: ErrorLogs;
  constructor() {
    this.errorLogsModel = new ErrorLogs();
  }
}
export default LogsService;
