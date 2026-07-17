import Markdown, { Components } from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { WandSparkles } from "lucide-react";

interface AiSuggestionCardProps {
  suggestion?: string;
  streaming?: boolean;
}

const AiSuggestionCard = ({
  suggestion,
  streaming = false,
}: AiSuggestionCardProps) => {
  const hasContent = !!suggestion && suggestion.length > 0;

  return (
    <Card className="pt-0 mt-6">
      <CardHeader className="bg-input p-4">
        <CardTitle className="font-semibold">
          <div className="flex gap-2 items-center">
            <WandSparkles size={18} /> Suggested Fix
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="text-muted-foreground text-base">
          {!hasContent && !streaming && (
            <p className="italic text-sm">Chưa có đề xuất nào.</p>
          )}

          {!hasContent && streaming && (
            <p className="italic text-sm animate-pulse">
              AI đang soạn đề xuất fix...
            </p>
          )}

          {hasContent && (
            <>
              <Markdown components={MarkdownComponents}>
                {suggestion}
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

const MarkdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="my-3 rounded-lg overflow-hidden border border-zinc-800 text-sm">
        <SyntaxHighlighter
          style={oneDark as { [key: string]: React.CSSProperties }}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: "1rem", background: "#18181b" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className="bg-rose-50 text-rose-600 font-mono px-1 py-0.5 rounded text-xs mx-0.5 font-semibold"
        {...props}
      >
        {children}
      </code>
    );
  },
  strong: ({ node, ...props }) => (
    <strong
      className="px-1 py-0.5 rounded font-semibold bg-input font-mono text-xs"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="text-base font-semibold text-zinc-900 mt-4 mb-2 first:mt-0 tracking-tight"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
  ),
};

export default AiSuggestionCard;