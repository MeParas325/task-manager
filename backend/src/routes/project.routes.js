import express from "express";
import ProjectController from "../controllers/project.controller.js";
import userAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

// get routes
router.get("/available", 
    userAuth,
    ProjectController.getAvailableProjects
)

router.get("/my", 
    userAuth,
    ProjectController.getUserProjects
)

router.get("/single/:projectId",
    userAuth,
    ProjectController.getSingleProject
)


// post routes
router.post("/create-project",
    userAuth,
    ProjectController.createProject
)

router.post("/enroll-project",
    userAuth,
    ProjectController.enrollProject
)


export default router;