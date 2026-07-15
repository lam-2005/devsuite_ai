import express, { type Express } from "express";
import cors from "cors";
import logsRouter from "./routers/logs.route.js";

const app: Express = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.use("/api/logs", logsRouter);
app.get("/", (req, res) => res.send("heello"));

export default app;
