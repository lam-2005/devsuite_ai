type EnvironmentType = "dev" | "prod";
type AiStatusType = "success" | "pending" | "failed";

export interface ErrorInterface {
  error_group_id: string;
  error_count: number;
  ai_status: AiStatusType;
  project_id: string;
  project_name: string;
  environment: EnvironmentType;
  error_message: string;
  last_seen: string;
}

export interface ErrorDetailInterface extends ErrorInterface {
  error_fingerprint: string;
  ai_reason: string;
  ai_suggestion: string;
  updated_at: string;
  stack_trace: string;
  line: number;
  file_path: string;
  raw_line_text: string;
}
