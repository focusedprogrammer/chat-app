// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.use(
//   "/api/auth",
//   require("./routes/authRoutes")
// );

// app.use(
// "/api/follow",
// require("./routes/followRoutes")
// );

// app.use(
//   "/api/chat",
//   require("./routes/chatRoutes")
// );

// app.use(
//   "/api/users",
//   require("./routes/userRoutes")
// );

// app.listen(process.env.PORT, () => {
//   console.log(
//     `Server Running ${process.env.PORT}`
//   );
// });

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

app.use(cors());

app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/follow",
  require("./routes/followRoutes")
);

app.use(
  "/api/chat",
  require("./routes/chatRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

io.on("connection", (socket) => {

  console.log(
    "User Connected",
    socket.id
  );

  socket.on(
    "join",
    (userId) => {

      socket.join(
        `user_${userId}`
      );

    }
  );

  socket.on(
    "typing",
    (data) => {

      io.to(
        `user_${data.receiverId}`
      ).emit(
        "typing",
        {
          senderId:
          data.senderId
        }
      );

    }
  );

  socket.on(
    "stopTyping",
    (data) => {

      io.to(
        `user_${data.receiverId}`
      ).emit(
        "stopTyping"
      );

    }
  );

  socket.on(
    "disconnect",
    () => {

      console.log(
        "Disconnected"
      );

    }
  );

});

server.listen(
  process.env.PORT,
  () => {

    console.log(
      `Server Running ${process.env.PORT}`
    );

  }
);