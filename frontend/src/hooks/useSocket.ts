"use client";
import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

export default function useSocket() {
  const [socket] = useState<Socket>(() => getSocket());
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  const connect = useCallback(() => {
    if (socket.connected) return;
    socket.connect();
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket.connected) socket.disconnect();
  }, [socket]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      socket.emit(event, data);
    },
    [socket],
  );

  const on = useCallback(
    <T>(event: string, handler: (payload: T) => void) => {
      socket.on(event, handler);
    },
    [socket],
  );

  const off = useCallback(
    <T>(event: string, handler: (payload: T) => void) => {
      socket.off(event, handler);
    },
    [socket],
  );

  return { socket, connected, connect, disconnect, emit, on, off };
}
