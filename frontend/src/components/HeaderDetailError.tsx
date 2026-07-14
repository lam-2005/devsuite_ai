import React from "react";

const HeaderDetailError = ({
  title,
  status,
  count,
  last_seen,
}: {
  title: string;
  status: string;
  count: string;
  last_seen: string;
}) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="mt-2 text-sm text-muted-foreground flex gap-4">
        <div className="bg-accent px-3 py-1.5 flex items-center rounded-full gap-1 capitalize">
          <span
            className={`${
              status === "success"
                ? "bg-success"
                : status === "pending"
                  ? "relative bg-warning after:size-3 after:absolute after:bg-warning after:animate-ping after:rounded-full after:opacity-75"
                  : "bg-error"
            } size-3 rounded-full block`}
          ></span>
          Status:
          <span
            className={`${
              status === "success"
                ? "text-success"
                : status === "pending"
                  ? "text-warning"
                  : "text-error"
            } font-semibold`}
          >
            {status}
          </span>
        </div>
        <div className="bg-accent px-3 py-1.5 rounded-full ">
          Count: <span className="font-semibold text-foreground">{count}</span>
        </div>
        <div className="bg-accent px-3 py-1.5 rounded-full ">
          Last_seen:{" "}
          <span className="font-semibold text-foreground">{last_seen}</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderDetailError;
