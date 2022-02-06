const express = require("express");
const cors = require("cors");
const http = require("http");
//const socketio = require("socket.io");

const { addUser, removeUser, getUser, getUserInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// cors
app.use(cors());
// router
app.use(router);

// socket io
io.on("connection", (socket) => {
  console.log("we have connected");

  // on join
  socket.on("join", ({ name, room }, callback) => {
    // add user
    const { error, user } = addUser({ id: socket.id, name: name, room: room });

    if (error) return callback(error);

    // welcome message
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to room ${user.room}`,
    });

    // send message to everyone beside that user
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    // join the user in a room
    socket.join(user.room);

    callback();
  });

  // on send message
  socket.on("sendMessage"),
    (message, callback) => {
      const user = getUser(socket.id);

      // send message to that room
      io.to(user.room).emit("message", { user: user.name, text: message });
      callback();
    };

  //on disconnect
  socket.on("disconnect", () => {
    console.log("user have left");
  });
});

// listen on PORT
server.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
