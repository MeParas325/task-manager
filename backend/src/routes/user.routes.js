import express from "express";
import UserController from "../controllers/user.controller.js";

// GET the ROUTER from EXPRESS
const router = express.Router();

// LOGIN ROUTE
router.post("/login", UserController.login);

// REGISTER ROUTE
router.post("/register", UserController.register);

export default router;



