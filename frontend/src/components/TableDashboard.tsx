"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { timeAgo } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import PaginationDashboard from "./PaginationDashboard";
const mockApi = [
  {
    error_group_id: "eg_01j2x3456789",
    error_count: 142,
    ai_status: "success",
    project_id: "p_ticknow_prod",
    project_name: "TickNow",
    environment: "PROD",
    error_message: "TypeError: Cannot read properties of null (reading 'map')",
    last_seen: "2026-07-12T15:50:00.000Z",
  },
  {
    error_group_id: "eg_01j2x9876543",
    error_count: 15,
    ai_status: "pending",
    project_id: "p_devjournal_dev",
    project_name: "DevJournal",
    environment: "DEV",
    error_message:
      "AxiosError: Request failed with status code 500 at /api/v1/posts",
    last_seen: "2026-07-12T15:27:30.000Z",
  },
  {
    error_group_id: "eg_01j2x5554443",
    error_count: 8,
    ai_status: "failed",
    project_id: "p_ticknow_prod",
    project_name: "TickNow",
    environment: "PROD",
    error_message: " AuthError: Token expired or invalid signature",
    last_seen: "2026-07-12T14:30:00.000Z",
  },
  {
    error_group_id: "eg_01j2x5554444",
    error_count: 8,
    ai_status: "failed",
    project_id: "p_ticknow_prod",
    project_name: "TickNow",
    environment: "PROD",
    error_message: " AuthError: Token expired or invalid signature",
    last_seen: "2026-07-12T14:30:00.000Z",
  },
  {
    error_group_id: "eg_01j2x5554445",
    error_count: 8,
    ai_status: "failed",
    project_id: "p_ticknow_prod",
    project_name: "TickNow",
    environment: "PROD",
    error_message: " AuthError: Token expired or invalid signature",
    last_seen: "2026-07-12T14:30:00.000Z",
  },
];
const TableDashboard = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const renderTimeAgo = (dateString: string) => {
    if (!dateString) return "-";
    return timeAgo(dateString, tick);
  };
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Error</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockApi.map((data) => (
            <TableRow key={data.error_group_id}>
              <TableCell>
                {data.project_name}{" "}
                <span
                  className={`${data.environment === "PROD" ? "bg-success/20 text-success" : "bg-info/20 text-info"}  py-1.5 px-2 rounded-full text-xs font-bold`}
                >
                  {data.environment === "PROD" ? "Production" : "Development"}
                </span>
              </TableCell>
              <TableCell
                className="max-w-80  text-red-500"
                title={data.error_message}
              >
                <div className=" line-clamp-2 text-wrap">
                  {data.error_message}
                </div>
              </TableCell>
              <TableCell>{data.error_count}</TableCell>
              <TableCell className="capitalize">
                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      data.ai_status === "success"
                        ? "bg-success"
                        : data.ai_status === "pending"
                          ? "relative bg-warning after:size-3 after:absolute after:bg-warning after:animate-ping after:rounded-full after:opacity-75"
                          : "bg-error"
                    } size-3 rounded-full block`}
                  ></span>
                  {data.ai_status}
                </div>
              </TableCell>
              <TableCell>{renderTimeAgo(data.last_seen)}</TableCell>
              <TableCell>
                {data.ai_status !== "pending" ? (
                  <Button className="flex gap-1 items-center ">
                    <RotateCcw size={14} /> Retry
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationDashboard />
    </div>
  );
};

export default TableDashboard;
