import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import earningRoutes from "./routes/earningRoutes.js";

const app = express();
dotenv.config();

connectDB();

const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", branchRoutes);
app.use("/api", studentRoutes);
app.use("/api", paymentRoutes);
app.use("/api", earningRoutes);
app.use("/api", statusRoutes);

app.listen(port, () => {
  console.log(`server is ready at localhost:${port}`);
});
