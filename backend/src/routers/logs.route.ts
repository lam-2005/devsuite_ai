import { Router } from "express";
import pool from "../config/db.js";
import LogsController from "../controller/logs.controller.js";

const router: Router = Router();

const CLogs = new LogsController();

router.post("/report", CLogs.createLog);

export default router;
