import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "okay", message: "server is running" });
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
