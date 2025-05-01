import mongoose, { mongo } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
      },
    ],

    assignedTo: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ADD TASK TO THE PROJECT COLLECTION
projectSchema.methods.addTask = async function (taskId) {
  if (!this.tasks.includes(taskId)) {
    this.tasks.push(taskId);
    await this.save();
  }
  return this;
};

export default mongoose.model("Project", projectSchema);
