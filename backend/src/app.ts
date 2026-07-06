import express, { type Express } from "express";

import logsRouter from "./routers/logs.route.js";

const app: Express = express();

app.use(express.json());
app.use("/api/logs", logsRouter);

export default app;
