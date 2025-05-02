import { createSlice } from "@reduxjs/toolkit";

const availableProjects = createSlice({
    name: "availableProjects",
    initialState: [],
    reducers: {
        addAvailableProjects: (state, action) => {
            return action.payload;
        },
        removeAvailableProjects: (state, action) => {
            return state.filter((project) => project._id !== action.payload)
        }
    }
})

export const {
    addAvailableProjects,
    removeAvailableProjects
} = availableProjects.actions;

export default availableProjects.reducer;