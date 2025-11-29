import dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(process.cwd(), ".env") });
import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
