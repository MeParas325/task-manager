import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";

class TaskController {

  // CREATE TASK
  static createTask = async (req, res) => {
    const session = await mongoose.startSession();
    try {
      // START THE SESSION AND TRANSACTION
      session.startTransaction();

      // GET THE title, status, projectId
      const { title, description, status, projectId } = req.body;
      const createdBy = req.user._id;

      if (!title) throw new Error("Title is required");
      if (!description) throw new Error("")
      if (!projectId) throw new Error("Project ID is required");

      // CREATE NEW INSTANCE OF TASK
      const task = new Task({
        title,
        status,
        description,
        project: projectId,
        createdBy,
      });

      // SAVE THE TASK INTO THE DATABASE
      const savedTask = await task.save({ session });
      // THROW ERROR IF TASK IS NOT SAVED
      if (!savedTask) throw new Error("Unable to save the task");

      // FIND PROJECT
      const project = await Project.findById({ _id: projectId });
      if (!project) throw new Error("project not found");

      // UPDATE THE PROJECT TASK LIST
      await project.addTask(savedTask._id);

      // COMMIT TRANSACTION
      session.commitTransaction();

      res.status(200).json({
        msg: "Task created successfully",
        success: true,
        data: savedTask,
      });
    } catch (error) {
      // ABORT THE TRANSACTION
      session.abortTransaction();

      res.status(400).json({
        msg: error.message,
        success: false,
        data: {},
      });
    }
  };

  // READ TASK
  static readTask = async (req, res) => {
    try {
      // GET THE TASK ID
      const { taskId } = req.body;

      // FIND TASK
      const task = await Task.findById({ _id: taskId });
      if (!task) throw new Error("Unable to find task");

      const userId = req.user._id;
      // Check if user ID exists in readBy array
      const hasUserRead = task.readBy.some(
        (id) => id.toString() === userId.toString()
      );

      if (!hasUserRead) {
        // PUSH THE TASK IN THE ARRAY
        task.readBy.push(userId);
        // SAVE THE TASK TO THE DATABASE
        await task.save();
      }

      // SEND BACK THE RESPONSE
      res.status(200).json({
        msg: "Task read by " + req.user.name,
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(400).json({
        msg: error.message,
        success: true,
        data: {},
      });
    }
  };

  // UPDATE TASK
  static updateTask = async (req, res) => {
    try {
      
      const {taskId} = req.params;

      // CHECK IF TASK EXIST OR NOT
      const isTaskExist = await Task.findOne({_id: taskId});

      // THROW ERROR IF NOT EXIST
      if(!isTaskExist) 
          throw new Error("Task is not exist");

      // UPDATE THE TASK
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {new: true});

      // THROW ERROR IF TASK IS NOT FOUND
      if(!updatedTask) throw new Error("No Task found");

      res.status(200).json({
        msg: "Task updated successfully",
        success: true,
        data: updatedTask
      })  

      
    } catch (error) {
        res.status(400).json({
          msg: error.message,
          success: false,
          data: {}
        })
    }
  };

// DELETE TASK
static deleteTask = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { taskId } = req.body;

    // Validate taskId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error("Invalid Task ID");
    }

    // Check if the task exists
    const isTaskExist = await Task.findById(taskId);
    if (!isTaskExist) {
      throw new Error("Task does not exist");
    }

    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId).session(session);

    // Remove task reference from any project
    await Project.updateMany(
      { tasks: taskId },
      { $pull: { tasks: taskId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      msg: "Task deleted successfully",
      success: true,
      data: deletedTask
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      msg: error.message,
      success: false,
      data: null
    });
  }
};

}

export default TaskController;
