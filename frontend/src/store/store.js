import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import availableProjectsReducer from "./slices/availableProjectsSlice.js";
import myProjectsReducer from "./slices/myProjectsSlice.js"
import projectReducer from "./slices/projectSlice.js"

const store = configureStore({
    reducer: {
        user: userReducer,
        availableProjects: availableProjectsReducer,
        myProjects: myProjectsReducer,
        project: projectReducer
    }
})

export default store;