import { createSlice } from "@reduxjs/toolkit";

const myProjectsSlice = createSlice({
  name: "myProjects",
  initialState: [],
  reducers: {
    addMyProjects: (state, action) => {
      return action.payload;
    },
    addSingleMyProject: (state, action) => {
      console.log("action payload is: ", action.payload);
      state.push(action.payload);
    }
  },
});

export const {
    addMyProjects, 
    addSingleMyProject
} = myProjectsSlice.actions;

export default myProjectsSlice.reducer