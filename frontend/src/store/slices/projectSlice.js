import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projectSlice",
  initialState: null,
  reducers: {
    addProject: (state, action) => {
      return action.payload;
    },
    removeProject: (state, action) => {
      return null;
    },
    addTask: (state, action) => {
        state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const updatedTask = action.payload;

      const index = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );

      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
    deleteTask: (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    }
  },
});

export const { addProject, removeProject, updateTask, deleteTask, addTask } = projectSlice.actions;
export default projectSlice.reducer;
