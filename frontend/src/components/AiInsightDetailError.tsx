"use client";
import AiReasonCard from "./AiReasonCard";
import AiSuggestionCard from "./AiSuggestionCard";
import { ErrorDetailInterface } from "@/types/type";
import { useAppSelector } from "@/hooks/useAppStore";

const AiInsightDetailError = ({ data }: { data: ErrorDetailInterface }) => {
  const { aiReasonBuffer, aiSuggestionBuffer } = useAppSelector(
    (state) => state.errors,
  );

  const isStreaming = data.ai_status === "pending";
  const reasonText = isStreaming ? aiReasonBuffer : data.ai_reason;
  const suggestionText = isStreaming ? aiSuggestionBuffer : data.ai_suggestion;

  return (
    <div className="w-3/5">
      <div className="flex gap-2.5 text-muted-foreground items-center text-sm font-semibold">
        AI INSIGHTS <span className="bg-border h-px flex-1"></span> Powered by
        Gemini
      </div>
      <div>
        <AiReasonCard reason={reasonText} streaming={isStreaming} />
        <AiSuggestionCard suggestion={suggestionText} streaming={isStreaming} />
      </div>
    </div>
  );
};

export default AiInsightDetailError;
