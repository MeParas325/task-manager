import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ADD PROJECTS TO THE USER COLLECTION
userSchema.methods.addProject = async function (projectId) {
    if (this.projects.length >= 4) {
        throw new Error("You cannot have more than 4 projects");
    }
    if (!this.projects.includes(projectId)) {
        this.projects.push(projectId);
        await this.save();
    }
    return this;
};

// GET JET
userSchema.methods.getJWT = function () {
    // create a jwt
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return token;
};

// VALIDATE the PASSWORD
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    // CHECK if PASSWORD is VALID
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        this.password
    );
    return isPasswordValid;
};

export default mongoose.model("User", userSchema);
