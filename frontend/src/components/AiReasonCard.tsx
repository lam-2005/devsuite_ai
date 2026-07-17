import Markdown from "react-markdown";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Brain } from "lucide-react";

interface AiReasonCardProps {
  reason?: string;
  streaming?: boolean;
}

const AiReasonCard = ({ reason, streaming = false }: AiReasonCardProps) => {
  const hasContent = !!reason && reason.length > 0;

  return (
    <Card className="pt-0 mt-6">
      <CardHeader className="bg-input p-4">
        <CardTitle className="font-semibold">
          <div className="flex gap-2 items-center">
            <Brain size={18} /> Root Cause Analysis
          </div>
        </CardTitle>
        <CardAction className="">
          <span className="bg-green-500 font-semibold text-background px-3 py-1 flex items-center rounded-lg">
            AI Generated
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold">Why did this happen?</h3>
        <div className="text-muted-foreground text-base mt-2">
          {!hasContent && !streaming && (
            <p className="italic text-sm">Chưa có phân tích nào.</p>
          )}

          {!hasContent && streaming && (
            <p className="italic text-sm animate-pulse">
              AI đang phân tích nguyên nhân...
            </p>
          )}

          {hasContent && (
            <>
              <Markdown
                components={{
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-rose-50 text-error font-mono px-1 py-0.5 rounded text-xs mx-0.5 font-semibold"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="bg-input font-mono px-1 py-0.5 rounded text-xs mx-0.5 font-semibold"
                      {...props}
                    />
                  ),
                }}
              >
                {reason}
              </Markdown>
              {streaming && (
                <span className="inline-block w-2 h-4 bg-foreground ml-0.5 align-middle animate-pulse" />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiReasonCard;
