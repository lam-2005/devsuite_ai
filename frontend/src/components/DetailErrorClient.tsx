import React from "react";
import HeaderDetailError from "./HeaderDetailError";
import RawErrorDetailError from "./RawErrorDetailError";
import AiInsightDetailError from "./AiInsightDetailError";
import { ErrorDetailInterface } from "@/types/type";

const DetailErrorClient = ({
  initData,
}: {
  initData: ErrorDetailInterface;
}) => {
  return (
    <>
      <HeaderDetailError data={initData} />
      <div className="w-full flex gap-6 p-6">
        <RawErrorDetailError data={initData} />
        <AiInsightDetailError data={initData} />
      </div>
    </>
  );
};

export default DetailErrorClient;
