import { Router } from "express";
import { HealthCheck } from "../controllers/healthcheck.controllers.js";

const router = Router();
// router.route("/").get(HealthCheck);
//if user hits /api/v1/healthcheck/test
router.route("/test").get(HealthCheck);
router.get("/", HealthCheck); //better way to write the above
export default router;
