import express from "express";
import { login } from "../../controllers/loginController.js";

const router = express.Router();

// Login simple
router.post("/api/auth/login", login);

export default router;
