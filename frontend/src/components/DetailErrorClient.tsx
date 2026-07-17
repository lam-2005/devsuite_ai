"use client";
import { useEffect } from "react";
import HeaderDetailError from "./HeaderDetailError";
import RawErrorDetailError from "./RawErrorDetailError";
import AiInsightDetailError from "./AiInsightDetailError";
import { ErrorDetailInterface } from "@/types/type";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { setDetailData } from "@/lib/features/errorSlice";
import useDetailError from "@/hooks/useDetailError";

const DetailErrorClient = ({
  initData,
  id,
}: {
  initData: ErrorDetailInterface;
  id: string;
}) => {
  const dispatch = useAppDispatch();

  // Đồng bộ dữ liệu SSR vào Redux ngay khi vào trang
  useEffect(() => {
    dispatch(setDetailData(initData));
  }, [initData, dispatch]);

  // Join room + lắng nghe toàn bộ AI streaming events, tự cleanup khi unmount
  useDetailError(id);

  // Đọc dữ liệu LUÔN từ store (không phải initData nữa), để nhận cập nhật realtime
  const storeData = useAppSelector((state) => state.errors.detail);
  const currentData =
    storeData && !Array.isArray(storeData) ? storeData : initData;

  return (
    <>
      <HeaderDetailError data={currentData} />
      <div className="w-full flex gap-6 p-6">
        <RawErrorDetailError data={currentData} />
        <AiInsightDetailError data={currentData} />
      </div>
    </>
  );
};

export default DetailErrorClient;
