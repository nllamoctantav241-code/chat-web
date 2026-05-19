const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// Guardar mensajes por sala
const roomMessages = {};

// Usuarios conectados
const roomUsers = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("joinRoom", ({ room, user }) => {
    socket.join(room);

    socket.room = room;
    socket.user = user;

    // Guardar usuario conectado
    if (!roomUsers[room]) roomUsers[room] = [];
    roomUsers[room].push(user);

    // Enviar historial
    if (!roomMessages[room]) roomMessages[room] = [];
    socket.emit("chatHistory", roomMessages[room]);

    // Avisar conexión
    io.to(room).emit("status", `${user} 🟢 En línea`);
  });

  socket.on("chatMessage", ({ room, message, user }) => {
    const newMessage = { user, message };

    if (!roomMessages[room]) roomMessages[room] = [];
    roomMessages[room].push(newMessage);

    io.to(room).emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.user) {
      io.to(socket.room).emit(
        "status",
        `${socket.user} ⚫ Desconectado`
      );
    }
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});