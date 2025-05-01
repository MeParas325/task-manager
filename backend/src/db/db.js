import mongoose from "mongoose";

// function to connect with the database
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        throw new Error("MongoDB connection error: " + error.message);
    }

}

export default dbConnect;