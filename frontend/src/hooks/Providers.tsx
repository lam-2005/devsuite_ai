// StoreProvider.tsx — bản tạm nếu chưa có authSlice
"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import useSocket from "@/hooks/useSocket";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeStore());
  return (
    <Provider store={store}>
      <SocketInit>{children}</SocketInit>
    </Provider>
  );
}

function SocketInit({ children }: { children: React.ReactNode }) {
  const { connect } = useSocket();
  useEffect(() => {
    connect();
  }, [connect]);
  return <>{children}</>;
}
