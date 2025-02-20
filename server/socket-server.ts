import {
  CREATE_BOOKING_RIDE,
  CREATE_BOOKING_RIDE_LOGS,
  DELETE_BOOKING_RIDE,
  DELETE_MANY_BOOKING_RIDES,
  NOTIFICATION,
  UPDATE_BOOKING_RIDE,
} from "../keys/socket-keys";
import { BookingLogs, Bookings, User } from "@prisma/client";
import * as http from "http";
import { Server } from "socket.io";

const PORT = 3001;

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(
    CREATE_BOOKING_RIDE,
    (data: { data: Bookings; senderId: string }) => {
      io.emit(CREATE_BOOKING_RIDE, data);
    }
  );

  socket.on(
    UPDATE_BOOKING_RIDE,
    (data: { data: Bookings; senderId: string }) => {
      io.emit(UPDATE_BOOKING_RIDE, data);
    }
  );

  socket.on(DELETE_BOOKING_RIDE, (data: { id: string; senderId: string }) => {
    io.emit(DELETE_BOOKING_RIDE, data);
  });

  socket.on(
    DELETE_MANY_BOOKING_RIDES,
    (data: { ids: string[]; senderId: string }) => {
      io.emit(DELETE_MANY_BOOKING_RIDES, data);
    }
  );

  socket.on(
    CREATE_BOOKING_RIDE_LOGS,
    (data: { log: BookingLogs; senderId: string }) => {
      io.emit(CREATE_BOOKING_RIDE_LOGS, data);
    }
  );

  socket.on(NOTIFICATION, (data: { data: User; senderId: string }) => {
    io.emit(NOTIFICATION, data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running on http://localhost:${PORT}`);
});
