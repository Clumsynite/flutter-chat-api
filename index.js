const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const { PORT, DB_URL } = require("./config");

const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(authRouter);

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connection Successful"))
  .catch((e) => console.error(e));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at Port ${PORT}`);
});
