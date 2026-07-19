"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSocket from "@/hooks/useSocket";
import { ErrorDetailInterface, ErrorInterface } from "@/types/type";
import {
  aiAnalysisStart,
  aiReasonChunkReceived,
  aiSuggestionChunkReceived,
  aiAnalysisComplete,
  aiAnalysisError,
  updateDetailFromGroup,
} from "@/lib/features/errorSlice";

interface AiErrorPayload {
  ai_status: "failed";
  previous_result: Pick<
    ErrorDetailInterface,
    "ai_reason" | "ai_suggestion" | "file_path" | "line" | "raw_line_text"
  > | null;
}

const useDetailError = (id: string) => {
  const { emit, on, off, connected } = useSocket();
  const dispatch = useDispatch();

  // Join / leave room theo vòng đời component
  useEffect(() => {
    if (!connected || !id) return;
    emit("join_error_group", id);
    return () => {
      emit("leave_error_group", id);
    };
  }, [connected, emit, id]);

  // Lắng nghe toàn bộ AI streaming events
  useEffect(() => {
    if (!connected || !id) return;

    const onStart = () => dispatch(aiAnalysisStart());
    const onReasonChunk = (data: { chunk: string }) =>
      dispatch(aiReasonChunkReceived(data.chunk));
    const onSuggestionChunk = (data: { chunk: string }) =>
      dispatch(aiSuggestionChunkReceived(data.chunk));
    const onComplete = (
      data: Pick<
        ErrorDetailInterface,
        "ai_status" | "file_path" | "line" | "raw_line_text"
      >,
    ) => dispatch(aiAnalysisComplete(data));
    const onFailed = (data: AiErrorPayload) => dispatch(aiAnalysisError(data));
    const onGroupUpdated = (data: { group: ErrorInterface }) =>
      dispatch(updateDetailFromGroup(data.group));

    on<void>("ai_start", onStart);
    on<{ chunk: string }>("ai_reason_chunk", onReasonChunk);
    on<{ chunk: string }>("ai_suggestion_chunk", onSuggestionChunk);
    on<
      Pick<
        ErrorDetailInterface,
        "ai_status" | "file_path" | "line" | "raw_line_text"
      >
    >("ai_complete", onComplete);
    on<AiErrorPayload>("ai_error", onFailed);
    on<{ group: ErrorInterface }>("error_group_updated", onGroupUpdated);

    return () => {
      off<void>("ai_start", onStart);
      off<{ chunk: string }>("ai_reason_chunk", onReasonChunk);
      off<{ chunk: string }>("ai_suggestion_chunk", onSuggestionChunk);
      off<
        Pick<
          ErrorDetailInterface,
          "ai_status" | "file_path" | "line" | "raw_line_text"
        >
      >("ai_complete", onComplete);
      off<AiErrorPayload>("ai_error", onFailed);
      off<{ group: ErrorInterface }>("error_group_updated", onGroupUpdated);
    };
  }, [connected, id, on, off, dispatch]);
};

export default useDetailError;
