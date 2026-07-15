"use client";
import { Button } from "./ui/button";
import { ErrorDetailInterface } from "@/types/type";
import { timeAgo } from "@/lib/utils";
import { useState } from "react";

const HeaderDetailError = ({ data }: { data: ErrorDetailInterface }) => {
  const [tick, setTick] = useState(0);

  return (
    <div className=" flex items-center justify-between border-b border-border p-6">
      <div>
        <h1 className="text-2xl font-semibold">{data.error_message}</h1>
        <div className="mt-2 text-sm text-muted-foreground flex gap-4">
          <div className="bg-accent px-3 py-1.5 flex items-center rounded-full gap-1 capitalize">
            <span
              className={`${
                data.ai_status === "success"
                  ? "bg-success"
                  : data.ai_status === "pending"
                    ? "relative bg-warning after:size-3 after:absolute after:bg-warning after:animate-ping after:rounded-full after:opacity-75"
                    : "bg-error"
              } size-3 rounded-full block`}
            ></span>
            Status:
            <span
              className={`${
                data.ai_status === "success"
                  ? "text-success"
                  : data.ai_status === "pending"
                    ? "text-warning"
                    : "text-error"
              } font-semibold`}
            >
              {data.ai_status}
            </span>
          </div>
          <div className="bg-accent px-3 py-1.5 rounded-full ">
            Count:{" "}
            <span className="font-semibold text-foreground">
              {data.error_count}
            </span>
          </div>
          <div className="bg-accent px-3 py-1.5 rounded-full ">
            Last_seen:{" "}
            <span className="font-semibold text-foreground">
              {" "}
              {data.last_seen ? timeAgo(data.last_seen, tick) : "-"}
            </span>
          </div>
        </div>
      </div>
      <Button>Retry</Button>
    </div>
  );
};

export default HeaderDetailError;
