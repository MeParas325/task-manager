import React, { useEffect, useState } from "react";
import axios from "axios";
import {BASE_URL} from "../constants/constants.js"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAvailableProjects, removeAvailableProjects } from "../store/slices/availableProjectsSlice.js";
import toast from "react-hot-toast";
import { addMyProjects } from "../store/slices/myProjectsSlice.js";

const AvailableProjects = () => {

  // use Selector
  const availableProjects = useSelector(store => store.availableProjects)

  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // get the user
  const user = useSelector(store => store.user);


  useEffect(() => {

    fetchAvailableProjects();

  }, [])


  // fetch available projects
  const fetchAvailableProjects = async () => {

    try {

      // API CALL
      const res = await axios.get(`${BASE_URL}/project/available`, {
        withCredentials: true,
      });

      dispatch(addAvailableProjects(res?.data?.data))

    } catch (error) {
      console.log("Error is: ", error.message);
    }

  }

  const handleJoinProject = async (project) => {

    try {

      const projectId = project._id;
      const res = await axios.post(`${BASE_URL}/project/enroll-project`, {
        projectId
      }, {
        withCredentials: true
      });

      toast.success(res?.data?.msg);
      dispatch(removeAvailableProjects(project._id));
      dispatch(addMyProjects(project))
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  }

  return availableProjects.length > 0 ? (
    availableProjects.map((project) => (
      <div
        key={project._id}
        className="bg-gray-700 rounded p-3 flex justify-between items-start"
      >
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-xs text-gray-400">{project.assignedTo.length} members</p>
          <p className="mt-1 text-xs text-gray-300">{project.description}</p>
        </div>
        <button
          onClick={() => handleJoinProject(project)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition"
        >
          Join
        </button>
      </div>
    ))
  ) : (
    <p className="text-gray-400">No available projects.</p>
  );
};

export default AvailableProjects;
