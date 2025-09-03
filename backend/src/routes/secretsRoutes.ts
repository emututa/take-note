


import { Router } from "express";
import * as secretsController from "../controllers/secretsController";

const router = Router();

router.get("/check", secretsController.checkPassword); // check if password exists
router.post("/set-password", secretsController.setPassword);
router.post("/verify", secretsController.verifyPassword);
router.post("/change-password", secretsController.changePassword);

export default router;
