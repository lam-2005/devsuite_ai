import React from "react";
import { ErrorTrace } from "./ErrorTrace";
import { ErrorDetailInterface } from "@/types/type";

const RawErrorDetailError = ({ data }: { data: ErrorDetailInterface }) => {
  return (
    <div className="w-2/5">
      <div className="flex gap-2.5 text-muted-foreground items-center text-sm font-semibold">
        RAW ERROR <span className="bg-border h-px flex-1"></span>
      </div>
      <ErrorTrace data={data} />
    </div>
  );
};

export default RawErrorDetailError;
