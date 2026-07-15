import Markdown, { Components } from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Giao diện tối giống VS Code
import { WandSparkles } from "lucide-react";
const AiSuggestionCard = ({ suggestion }: { suggestion: string }) => {
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
          <Markdown components={MarkdownComponents}>{suggestion}</Markdown>
        </div>
      </CardContent>
    </Card>
  );
};

const MarkdownComponents: Components = {
  // Định nghĩa chuẩn cho thẻ code
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

  // Các thẻ còn lại tự động nhận đúng kiểu dữ liệu (ComponentPropsWithoutRef)
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
