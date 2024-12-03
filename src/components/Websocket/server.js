const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*", // Allow all origins for testing; restrict in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send a test message to the client
  socket.emit("message", {
    payload: {
      action: "REFESH-CART",
      response: "This is a test response from the server.",
    },
  });

  // Handle client disconnection
  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id, reason);
  });
});

console.log("Socket.IO server running on ws://localhost:3001");