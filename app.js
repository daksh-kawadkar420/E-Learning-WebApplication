require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// MY ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

// DB CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true /**It means we have to add port database connection String */,
    useUnifiedTopology: true /**To remove depreciate warning of server and engine */,
  })
  .then(() => {
    console.log("DB CONNECTION SUCESSFUL");
  });

// MY MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors()
); /**This policy is used to secure a certain web server from access by other website or domain. */

// MY API's
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

// PORT
const port = process.env.PORT || 8000;

// START SERVER
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
