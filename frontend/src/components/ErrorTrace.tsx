import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Terminal } from "lucide-react";
const stackTrace =
  "TypeError: Cannot read properties of null (reading 'map')\n    at Array.map (<anonymous>)\n    at MovieList (/app/components/MovieList.jsx:24:18)\n    at renderWithHooks (/app/node_modules/react-dom/cjs/react-dom.development.js:14985:18)\n    at mountIndeterminateComponent (/app/node_modules/react-dom/cjs/react-dom.development.js:17811:13)\n    at beginWork (/app/node_modules/react-dom/cjs/react-dom.development.js:19049:16)\n    at HTMLUnknownElement.callCallback (/app/node_modules/react-dom/cjs/react-dom.development.js:3945:14)\n    at Object.invokeGuardedCallbackDev (/app/node_modules/react-dom/cjs/react-dom.development.js:3994:16)\n    at invokeGuardedCallback (/app/node_modules/react-dom/cjs/react-dom.development.js:4056:31)\n    at beginWork$1 (/app/node_modules/react-dom/cjs/react-dom.development.js:23964:7)\n    at performUnitOfWork (/app/node_modules/react-dom/cjs/react-dom.development.js:22776:12)";
export function ErrorTrace() {
  const logLines = stackTrace ? stackTrace.split("\n") : [];

  const isSourceFile = (line: string) => {
    if (!line) return false;
    // Kiểm tra nếu chứa đường dẫn file dự án phổ biến và không nằm trong node_modules
    return (
      (line.includes("/app/") ||
        line.includes("/components/") ||
        line.includes("/pages/")) &&
      !line.includes("node_modules")
    );
  };
  const getFirstSourceLocation = () => {
    const sourceLine = logLines.find(isSourceFile);
    if (!sourceLine) return null;
    // Tìm đoạn chứa đường dẫn trong ngoặc hoặc text (Ví dụ đơn giản: trích xuất đoạn /app/...)
    const match = sourceLine.match(/(\/[^\s:]+:\d+:\d+|\/[^\s:]+:\d+)/);
    return match ? match[0] : null;
  };

  const errorLocation = getFirstSourceLocation();
  return (
    <Card className="bg-foreground text-background mt-6">
      <CardHeader className="border-b border-muted-foreground">
        <CardTitle>
          <h4 className="flex gap-1 text-sm items-center">
            <Terminal size={18} /> Stack Trace
          </h4>
        </CardTitle>
        <CardAction>
          <div className="space-x-2">
            <span className="size-3.5 bg-red-500 rounded-full inline-block"></span>
            <span className="size-3.5 bg-yellow-500 rounded-full inline-block"></span>
            <span className="size-3.5 bg-green-500 rounded-full inline-block"></span>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="border-b border-muted-foreground font-mono">
        <div className="text-error text-base pb-6">
          <h5>Error</h5>
          <p>{"TypeError: Cannot read properties of null (reading 'map')"}</p>
          <p className="text-muted-foreground ml-6">
            {errorLocation} {"  "}
            <span className="text-purple-400">line 24</span>
          </p>
        </div>
      </CardContent>
      <CardContent className="font-mono">
        <div className="text-base text-muted-foreground">
          <h5>Call Stack</h5>
          <div className="mt-2">
            {logLines.map((line, index) => {
              const isSource = isSourceFile(line);
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 px-2 py-1 rounded transition-colors text-sm leading-5
                  ${isSource ? "bg-purple-950/30 text-info  border-info" : "border-transparent"} border-l-2 `}
                >
                  {/* Số dòng bên trái mờ */}
                  <span className="select-none">{index + 1}</span>

                  {/* Nội dung chuỗi log */}
                  <div className="break-all">{line}</div>
                  {isSource && (
                    <span className="text-[10px] bg-purple-400 font-semibold text-background px-1.5 py-0.5 rounded uppercase tracking-wide select-none">
                      source
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
