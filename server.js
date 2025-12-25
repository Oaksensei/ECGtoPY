const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 10000;

// สร้าง HTTP server
const server = http.createServer();

// ผูก socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Expo / Mobile
    methods: ["GET", "POST"],
  },
});

console.log("Socket.IO server starting...");

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // รับ ECG packet จาก Python
  socket.on("ecg", (data) => {
    console.log("RECEIVED ECG:", JSON.stringify(data).slice(0, 80));

    // broadcast ไป client ทุกตัว (รวม Expo)
    socket.broadcast.emit("ecg", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Socket.IO server running on port", PORT);
});
