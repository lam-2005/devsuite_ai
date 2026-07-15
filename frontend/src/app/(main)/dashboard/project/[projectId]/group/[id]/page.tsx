import AiInsightDetailError from "@/components/AiInsightDetailError";
import BackToDashboard from "@/components/BackToDashboard";
import DetailErrorClient from "@/components/DetailErrorClient";
import HeaderDetailError from "@/components/HeaderDetailError";
import RawErrorDetailError from "@/components/RawErrorDetailError";
import errorAPI from "@/services/error.service";
import { ErrorDetailInterface } from "@/types/type";
import React from "react";

const DetailErrorPage = async ({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) => {
  const { id } = await params;
  const response = await errorAPI.fetchOne(id);
  const initData: ErrorDetailInterface = response.data;
  return (
    <div>
      <div className="pt-6 px-6">
        <BackToDashboard
          project_name={`${initData.project_name} (${initData.environment === "prod" ? "Production" : "Development"})`}
          error_message={initData.error_message}
        />
      </div>
      <DetailErrorClient initData={initData} />
    </div>
  );
};

export default DetailErrorPage;
