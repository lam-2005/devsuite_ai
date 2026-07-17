import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorDetailInterface } from "@/types/type";
import { Terminal } from "lucide-react";
export function ErrorTrace({ data }: { data: ErrorDetailInterface }) {
  const logLines = data.stack_trace ? data.stack_trace.split("\n") : [];

  const isSourceFile = (line: string) => {
    if (!line) return false;
    // Kiểm tra nếu chứa đường dẫn file dự án phổ biến và không nằm trong node_modules
    return line.includes(data.file_path) && !line.includes("node_modules");
  };

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
        <div className="text-error text-sm pb-6">
          <h5>Error</h5>
          <p>{data.error_message}</p>
          <p className="text-muted-foreground ml-6">
            {data.file_path} {"  "}
            <span className="text-purple-400">line {data.line}</span>
          </p>
        </div>
      </CardContent>
      <CardContent className="font-mono">
        <div className="text-sm text-muted-foreground">
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
