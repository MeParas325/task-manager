import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ["processing", "completed", "testing", "deployed"],
            message: "{VALUE} is not a valid status. Use: processing, completed, testing, deployed",
        },
        default: "processing",
        lowercase: true, // Converts input to lowercase (e.g., "COMPLETED" → "completed")
    },

    project: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Project"
    },

    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },

    readBy: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model("Task", taskSchema);