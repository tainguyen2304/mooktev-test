"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_keys_1 = require("../keys/socket-keys");
var http = require("http");
var socket_io_1 = require("socket.io");
var PORT = process.env.NEXT_PUBLIC_PORT_SOCKET_SERVERL;
var server = http.createServer();
var io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
io.on("connection", function (socket) {
    console.log("User connected: ".concat(socket.id));
    socket.on(socket_keys_1.CREATE_BOOKING_RIDE, function (data) {
        io.emit(socket_keys_1.CREATE_BOOKING_RIDE, data);
    });
    socket.on(socket_keys_1.UPDATE_BOOKING_RIDE, function (data) {
        io.emit(socket_keys_1.UPDATE_BOOKING_RIDE, data);
    });
    socket.on(socket_keys_1.DELETE_BOOKING_RIDE, function (data) {
        io.emit(socket_keys_1.DELETE_BOOKING_RIDE, data);
    });
    socket.on(socket_keys_1.DELETE_MANY_BOOKING_RIDES, function (data) {
        io.emit(socket_keys_1.DELETE_MANY_BOOKING_RIDES, data);
    });
    socket.on(socket_keys_1.CREATE_BOOKING_RIDE_LOGS, function (data) {
        io.emit(socket_keys_1.CREATE_BOOKING_RIDE_LOGS, data);
    });
    socket.on(socket_keys_1.NOTIFICATION, function (data) {
        io.emit(socket_keys_1.NOTIFICATION, data);
    });
    socket.on("disconnect", function () {
        console.log("User disconnected: ".concat(socket.id));
    });
});
server.listen(PORT, function () {
    console.log("\u2705 Socket.IO server running on http://localhost:".concat(PORT));
});
