import mongoose from "mongoose";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

class ProjectController {
  // CREATE a PROJECT
  static createProject = async (req, res) => {
    const session = await mongoose.startSession();
    try {
      // create a SESSION and start the TRANSACTION
      session.startTransaction();

      // GET the name
      const { name, description } = req.body;
      // GET the ID of LOGGED IN USER
      const createdBy = req.user._id;

      // CREATE the INSTANCE of Project
      const project = new Project({
        name,
        description,
        createdBy,
        assignedTo: req.user._id,
      });

      // SAVE the Project into the DATABASE
      const savedProject = await project.save();

      // if Project is not saved THROW an ERROR
      if (!savedProject) throw new Error("Unable to save project");

      // FIND USER
      const user = await User.findById(createdBy);
      if (!user) throw new Error("User not found");

      // UPDATE the USER's Projects list
      await user.addProject(savedProject._id);

      // COMMIT the TRANSACTION
      session.commitTransaction();

      // SEND RESPONSE
      res.status(200).json({
        msg: "Project created successfully",
        success: true,
        data: savedProject,
      });
    } catch (error) {
      session.abortTransaction();
      // SEND RESPONSE with ERROR
      res.status(400).json({
        msg: error.message,
        success: false,
        data: {},
      });
    }

    session.endSession();
  };

  // ENROLL INTO A PROJECT
  static enrollProject = async (req, res) => {

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { projectId } = req.body;

      // FIND PROJECT
      const project = await Project.findById({ _id: projectId });
      if (!project) throw new Error("project not found");

      // FIND THE CURRENT USER ID
      const currentUserId = req.user._id;

      // Add current user to assignedTo array if not already present
      if (!project.assignedTo.includes(currentUserId)) {
        project.assignedTo.push(currentUserId);
        await project.save({session});
      }

      // FIND THE USER
      const user = await User.findById({ _id: req.user._id });
      if (!user) throw new Error("User not found");

      // UPDATE THE PROJECT TASK LIST
      const updatedUser = await user.addProject(project._id);

      res.status(200).json({
        msg:
          updatedUser.name +
          " Enrolled into the " +
          project.name +
          " project successfully",
        success: true,
        data: updatedUser,
      });
      
      session.commitTransaction();
    } catch (error) {
      session.abortTransaction();
      res.status(400).json({
        msg: error.message,
        success: false,
        data: {},
      });
    }

    session.endSession();
  };

  // GET AVAILABLE PROJECTS
  static getAvailableProjects = async (req, res) => {

    try {
      
      // ENROLLED PROJECTS
      const enrolledProjects = req.user.projects;

      // FETCH THE AVAILABLE PROJECTS
      const availableProjects = await Project.find({
        _id: {$nin: enrolledProjects}
      })

      // SEND BACK THE RESPONSE
      res.status(200).json({
        msg: "Projects fetched successfully",
        success: true,
        data: availableProjects
      })

    } catch (error) {
        res.status(400).json({
          msg: "Unable to fetch Projects",
          success: false,
          data: {}
        })
    }
  }

  // GET USER PROJECTS
  static getUserProjects = async (req, res) => {

    try {

      // FETCH THE PROJECT FOR THE USER
      const projects = await Project.find({
        _id: {$in: req.user.projects},
      })


      // SEND BACK THE RESPONSE
      res.status(200).json({
        msg: "Projects fetched successfully",
        success: true,
        data: projects,
      })


    } catch (error) {
        res.status(400).json({
          msg: error.message,
          success: false,
          data: [],
        })
    }
  }

  // GET SINGLE PROJECT
  static getSingleProject = async (req, res) => {

    try {

      const {projectId} = req.params;

      const project = await Project.findById(projectId)
      .populate('tasks')         // Populate task details
      .populate("createdBy")
      .populate('assignedTo');   // Populate user details

    if (!project) {
      throw new Error("Project not found");
    }

    res.status(200).json({
      msg: "Project details fetched successfully",
      success: true,
      data: project,
    })
    } catch (error) {
        res.status(400).json({
          msg: error.message,
          success: false,
          data: {}
        })
    }
  }
}

export default ProjectController;
