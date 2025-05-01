import express from "express";
import { configDotenv } from "dotenv";
import dbConnect from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// CONFIG the Dot ENV
configDotenv();

// Initialize the APP
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

// GET the PORT
const PORT = process.env.PORT || 4000;

// IMPORTIMG ROUTES
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";

/*=================Routes=================== */
// AUTH ROUTE
app.use("/auth", userRouter);

// Project ROUTE
app.use("/project", projectRouter);

// TASK ROUTE
app.use("/task", taskRouter);


// connection to the database
dbConnect().then(() => {
    // if successfully connected to the database then start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
).catch((error) => {
    console.error(error.message);
})





