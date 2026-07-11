import { Router } from "express";
import LogsController from "../controller/logs.controller.js";

const router: Router = Router();

const CLogs = new LogsController();

router.post("/report", CLogs.createLog);
router.get("/errors", CLogs.getErrors);
router.get("/errors/:id", CLogs.getErrorByFingerprint);
router.post("/errors/:id/retry", CLogs.retry);

export default router;
