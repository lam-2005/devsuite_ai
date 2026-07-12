import { Bug, CheckCheck, LoaderCircle, X } from "lucide-react";
import StatCard from "./StatCard";
import { CardAction } from "./ui/card";

const OverviewDashboard = () => {
  return (
    <div className="w-full grid grid-cols-4 gap-4">
      <StatCard
        title="Total Errors"
        value={1283}
        icon={Bug}
        bgClass="bg-info/20"
        iconClass="text-info"
        action={<CardAction>Action</CardAction>}
      />

      <StatCard
        title="Successful Analyses"
        value={1283}
        icon={CheckCheck}
        bgClass="bg-success/20"
        iconClass="text-success"
      />

      <StatCard
        title="Pending Analyses"
        value={1283}
        icon={LoaderCircle}
        bgClass="bg-warning/20"
        iconClass="text-warning"
      />

      <StatCard
        title="Failed Analyses"
        value={1283}
        icon={X}
        bgClass="bg-error/20"
        iconClass="text-error"
      />
    </div>
  );
};

export default OverviewDashboard;
