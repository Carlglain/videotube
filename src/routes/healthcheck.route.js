import { Router } from "express";
import { HealthCheck } from "../controllers/healthcheck.controllers.js";

const router = Router();
router.route("/").get(HealthCheck);
//if user hits /api/v0/healthcheck/test
router.route("/test").get(HealthCheck);
export default router;
