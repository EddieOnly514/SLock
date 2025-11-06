import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "okay", message: "server is running" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
