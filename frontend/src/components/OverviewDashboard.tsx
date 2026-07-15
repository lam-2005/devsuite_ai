import { Bug, CheckCheck, LoaderCircle, X } from "lucide-react";
import StatCard from "./StatCard";
import { CardAction } from "./ui/card";

const OverviewDashboard = ({
  overview,
}: {
  overview: {
    totalErrors: number;
    success: number;
    pending: number;
    failed: number;
  };
}) => {
  return (
    <div className="w-full grid grid-cols-4 gap-4">
      <StatCard
        title="Total Errors"
        value={overview.totalErrors}
        icon={Bug}
        bgClass="bg-info/20"
        iconClass="text-info"
        action={<CardAction>Action</CardAction>}
      />

      <StatCard
        title="Successful Analyses"
        value={overview.success}
        icon={CheckCheck}
        bgClass="bg-success/20"
        iconClass="text-success"
      />

      <StatCard
        title="Pending Analyses"
        value={overview.pending}
        icon={LoaderCircle}
        bgClass="bg-warning/20"
        iconClass="text-warning"
      />

      <StatCard
        title="Failed Analyses"
        value={overview.failed}
        icon={X}
        bgClass="bg-error/20"
        iconClass="text-error"
      />
    </div>
  );
};

export default OverviewDashboard;
