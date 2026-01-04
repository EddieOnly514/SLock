import dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(process.cwd(), ".env") });
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import appsRoutes from "./routes/apps";
import catalogRoutes from "./routes/catalog";
import focusSessionRoutes from "./routes/focusSessions";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/focus-sessions', focusSessionRoutes);

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
