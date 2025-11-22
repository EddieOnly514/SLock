import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../../.env") });

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
