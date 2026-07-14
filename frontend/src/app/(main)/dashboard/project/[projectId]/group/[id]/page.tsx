import AiInsightDetailError from "@/components/AiInsightDetailError";
import BackToDashboard from "@/components/BackToDashboard";
import HeaderDetailError from "@/components/HeaderDetailError";
import RawErrorDetailError from "@/components/RawErrorDetailError";
import React from "react";

const DetailErrorPage = async ({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) => {
  const { projectId, id } = await params;
  console.log(projectId, id);

  return (
    <div>
      <div className="p-6 space-y-6 border-b border-border">
        <BackToDashboard
          project_name="Ticknow (Production)"
          error_message="TypeError: Cannot read properties of null (reading 'map')"
        />
        <HeaderDetailError
          title="TypeError: Cannot read properties of null (reading 'map')"
          status="success"
          count="149"
          last_seen="5 minutes ago"
        />
      </div>
      <div className="w-full flex gap-6 p-6">
        <RawErrorDetailError />
        <AiInsightDetailError />
      </div>
    </div>
  );
};

export default DetailErrorPage;
