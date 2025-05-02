import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constants/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AvailableProjects from './AvailableProjects';
import toast from "react-hot-toast";
import MyProjects from './MyProjects';
import { addSingleMyProject } from '../store/slices/myProjectsSlice';

const Body = () => {

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [activeTab, setActiveTab] = useState('my');

  // navigate
  const naviagte = useNavigate();

  // get the current logged in user
  const user = useSelector(store => store.user);

  // navigate
  const navigate = useNavigate();

  // dispatcb
  const dispatch = useDispatch();

  useEffect(() => {

    if(!user) {
      naviagte("/login");
      return;
    }

  }, [])



  const handleCreateProject = async (e) => {
    
    if(user.projects.length >= 4) {
      toast.error("You already enrolled in 4 projects now you cannot create or enroll in any other project");
      return;
    }

    e.preventDefault();
    const newProject = {
      name: projectName,
      description: projectDescription
    };

    try {
      const res = await axios.post(`${BASE_URL}/project/create-project`, newProject, {
        withCredentials: true
      });
      
      toast.success(res?.data?.msg);
      console.log("Create project response is: ", res?.data?.data);
      
      dispatch(addSingleMyProject(res?.data?.data));
    } catch (error) {
      console.log("Error is: ", error);
      toast.error(error?.response?.data?.msg);
    }

    setProjectName('');
    setProjectDescription('');
  };

  return ( <div className='flex flex-col items-center justify-center'>
      <h2 className="text-xl font-bold text-white mb-4">💼 Task Manager</h2>
    <div className="bg-gray-900 text-white px-4 py-6 w-[800px] h-auto">
      <div className="space-y-3">
        {/* Heading */}

        {/* Create Project */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-3">🚀 Create New Project</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full px-3 py-1.5 text-sm bg-gray-700 rounded border border-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project Description"
              rows={2}
              className="w-full px-3 py-1.5 text-sm bg-gray-700 rounded border border-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleCreateProject}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-sm rounded font-medium transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg shadow-md">
          <div className="flex text-sm">
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 text-center py-2 font-medium border-b-2 transition ${
                activeTab === 'my'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 text-center py-2 font-medium border-b-2 transition ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Available
            </button>
          </div>

          {/* Tab Content - Scrollable */}
          <div className="p-4 space-y-3 text-sm max-h-64 h-[206px] overflow-y-auto">
            {activeTab === 'my' ? (
              <MyProjects />
            ) : (
              <AvailableProjects />
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Body;
