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
import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import PaginationDashboard from "./PaginationDashboard";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { Pagination, setInitialData } from "@/lib/features/errorSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { ErrorInterface } from "@/types/type";

const TableDashboard = ({
  initData,
}: {
  initData: { data: ErrorInterface[]; pagination: Pagination };
}) => {
  const { data, loading, error } = useAppSelector((state) => state.errors);
  const dispatch = useAppDispatch();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    dispatch(setInitialData(initData));
  }, [dispatch, initData]);

  return (
    <>
      <div>
        <Table>
          <TableHeader className="sticky top-0">
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-muted-foreground">
            {loading === "pending" ? (
              <TableRow>
                <TableCell className="text-center" colSpan={6}>
                  Loading data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="text-error text-center" colSpan={6}>
                  An error occurred while retrieving data.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.error_group_id}>
                  <TableCell>
                    {item.project_name}{" "}
                    <span
                      className={`${item.environment === "prod" ? "bg-success/20 text-success" : "bg-info/20 text-info"}  py-1.5 px-2 rounded-full text-xs font-bold`}
                    >
                      {item.environment === "prod"
                        ? "Production"
                        : "Development"}
                    </span>
                  </TableCell>
                  <TableCell
                    className="max-w-80  text-red-500"
                    title={item.error_message}
                  >
                    <Link
                      href={`/dashboard/project/${item.project_id}/group/${item.error_group_id}`}
                      className=" line-clamp-2 text-wrap"
                    >
                      {item.error_message}
                    </Link>
                  </TableCell>
                  <TableCell>{item.error_count}</TableCell>
                  <TableCell className="capitalize">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          item.ai_status === "success"
                            ? "bg-success"
                            : item.ai_status === "pending"
                              ? "relative bg-warning after:size-3 after:absolute after:bg-warning after:animate-ping after:rounded-full after:opacity-75"
                              : "bg-error"
                        } size-3 rounded-full block`}
                      ></span>
                      <span
                        className={`${
                          item.ai_status === "success"
                            ? "text-success"
                            : item.ai_status === "pending"
                              ? "text-warning"
                              : "text-error"
                        } font-semibold`}
                      >
                        {item.ai_status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.last_seen ? timeAgo(item.last_seen, tick) : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        {item.ai_status !== "pending" && (
                          <DropdownMenuItem>Retry</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PaginationDashboard />
      </div>
    </>
  );
};

export default TableDashboard;
