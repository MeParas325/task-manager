import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { addMyProjects } from "../store/slices/myProjectsSlice";
import { Link } from "react-router-dom";

const MyProjects = () => {

  // enrolled projects
  const myProjects = useSelector(store => store.myProjects)

  // dispatch
  const dispatch = useDispatch();
  
  useEffect(() => {

    fetchMyProjects();

  }, [])

  const fetchMyProjects = async () => {

    try {

      // API CALL
      const res = await axios.get(`${BASE_URL}/project/my`, {
        withCredentials: true,
      });

      dispatch(addMyProjects(res?.data?.data))

    } catch (error) {
      console.log("Error is: ", error.message);
    }
  }

  return myProjects.length > 0 ? (
    myProjects.map((project) => (
      <div
        key={project._id}
        className="bg-gray-700 rounded p-3 flex justify-between items-start"
      >
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-xs text-gray-400">{project.assignedTo.length} members</p>
          <p className="mt-1 text-xs text-gray-300">{project.description}</p>
        </div>
        <Link to={`/project/${project._id}`}>
          <button className="text-xs text-blue-400 border border-blue-400 px-2 py-0.5 rounded hover:bg-blue-500 hover:text-white transition">
            View
          </button>
          </Link>
      </div>
    ))
  ) : (
    <p className="text-gray-400">No joined projects.</p>
  );
};

export default MyProjects;
