import express from "express";
import userAuth from "../middlewares/auth.middleware.js";
import TaskController from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create", 
    userAuth, 
    TaskController.createTask
);

router.put("/read", 
    userAuth, 
    TaskController.readTask
);

router.put("/update", 
    userAuth, 
    TaskController.updateTask
);

router.delete("/delete",
    userAuth,
    TaskController.deleteTask
);

export default router;