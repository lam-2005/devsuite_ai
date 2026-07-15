import React from "react";
import AiReasonCard from "./AiReasonCard";
import AiSuggestionCard from "./AiSuggestionCard";
import { ErrorDetailInterface } from "@/types/type";

const AiInsightDetailError = ({ data }: { data: ErrorDetailInterface }) => {
  return (
    <div className="w-3/5">
      {" "}
      <div className="flex gap-2.5 text-muted-foreground items-center text-sm font-semibold">
        AI INSIGHTS <span className="bg-border h-px flex-1"></span> Powered by
        Gemini
      </div>
      <div>
        <AiReasonCard reason={data.ai_reason} />
        <AiSuggestionCard suggestion={data.ai_suggestion} />
      </div>
    </div>
  );
};

export default AiInsightDetailError;
