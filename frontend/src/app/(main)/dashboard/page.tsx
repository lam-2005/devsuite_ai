import OverviewDashboard from "@/components/OverviewDashboard";
import TableDashboard from "@/components/TableDashboard";

const Dashboard = () => {
  return (
    <div className="w-full py-6 px-6 space-y-5">
      <div className="flex gap-5 ">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Error Groups</h2>
          <p className="text-muted-foreground text-sm mt-1.25">
            Manage and review error groups.
          </p>
        </div>
        <div>View mode</div>
        <div>Add new Button</div>
      </div>
      <OverviewDashboard />
      <TableDashboard />
    </div>
  );
};

export default Dashboard;
