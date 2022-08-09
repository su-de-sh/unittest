const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogRouter");
const userRouter = require("./controllers/userRouter");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => {
  // eslint-disable-next-line no-console
  console.log("MongoDb connected");
});

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
module.exports = app;
