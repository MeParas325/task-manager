import express from "express";
import ProjectController from "../controllers/project.controller.js";
import userAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-project",
    userAuth,
    ProjectController.createProject
)

router.post("/enroll-project",
    userAuth,
    ProjectController.enrollProject
)


export default router;