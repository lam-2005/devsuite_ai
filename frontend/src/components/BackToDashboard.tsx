import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const BackToDashboard = ({
  project_name,
  error_message,
}: {
  project_name: string;
  error_message: string;
}) => {
  return (
    <div className="text-muted-foreground flex gap-2 text-sm">
      <Link
        href={"/dashboard"}
        className="text-foreground flex items-center gap-1 font-semibold"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>{" "}
      <span>/</span>Project<span>/</span>
      <span>{project_name}</span>
      <span>/</span>
      <span className="text-foreground font-semibold">{error_message}</span>
    </div>
  );
};

export default BackToDashboard;
