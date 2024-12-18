import express from "express";
import { PORT } from "./config.js";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());
app.use(indexRoutes);
app.listen(PORT);
console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
