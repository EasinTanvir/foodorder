const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const app = express();
const HttpError = require("./helper/HttpError");
require("dotenv").config();
const pizzaRoutes = require("./routes/pizzaRoutes");
const userRoutes = require("./routes/userRoutes");
const sllRoutes = require("./routes/sslcommerceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
app.use(express.json());
app.use(express.static(path.join("public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );

  next();
});

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.once("error", (err) => console.log(err));
db.on("open", () => {
  console.log("database connected".yellow.bold);
});

app.use("/api/pizza", pizzaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", sllRoutes);
app.use("/api/orders", orderRoutes);

app.use(express.static(path.resolve(__dirname, "public", "index.html")));
// app.use((req, res, next) => {
//   const errors = new HttpError("no routes found for this path  ", 404);
//   return next(errors);
// });

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});

const server = app.listen(5000, () => {
  console.log("server running");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5000",
  },
});

io.on("connection", (socket) => {
  console.log("client connected");
});

app.set("name", io);
