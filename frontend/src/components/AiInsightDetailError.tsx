import React from "react";
import AiReasonCard from "./AiReasonCard";
import AiSuggestionCard from "./AiSuggestionCard";

const AiInsightDetailError = () => {
  return (
    <div className="w-3/5">
      {" "}
      <div className="flex gap-2.5 text-muted-foreground items-center text-sm font-semibold">
        AI INSIGHTS <span className="bg-border h-px flex-1"></span> Powered by
        Gemini
      </div>
      <div>
        <AiReasonCard />
        <AiSuggestionCard />
      </div>
    </div>
  );
};

export default AiInsightDetailError;
