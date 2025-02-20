import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";

interface SocketState {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connect: () => {
    if (get().socket) return; // Tránh kết nối nhiều lần

    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export const useSocket = () => {
  const { socket, connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return socket;
};

export default useSocket;
