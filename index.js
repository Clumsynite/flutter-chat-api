const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { PORT, DB_URL } = require("./config");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const friendRouter = require("./routes/friend");
const messageRouter = require("./routes/message");
const { handleClientOnline, handleClientOffline, handleClientTyping } = require("./socket/presence");

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (client) => {
  client.on("client_online", (id) => handleClientOnline({ id, io }));
  client.on("client_offline", (id) => handleClientOffline({ id, io }));
  client.on("client_typing", (data) => handleClientTyping({ data, io })); // data should be an object { userId, isTyping }
});

app.use((req, res, next) => {
  req._io = io;
  return next();
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(authRouter);
app.use(userRouter);
app.use(friendRouter);
app.use(messageRouter);

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connection Successful"))
  .catch((e) => console.error(e));

/** catch 404 and forward to error handler */
app.use("*", (req, res) => res.status(500).json({ error: "API endpoint doesn't exists" }));

/** Create HTTP server. */
server.listen(PORT, "0.0.0.0");
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port :: ${server.address().port}`);
});
