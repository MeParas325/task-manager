import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, addTask, deleteTask, updateTask } from '../store/slices/projectSlice';

const SingleProject = () => {
  const { projectId } = useParams();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({});

  const project = useSelector(store => store.project);
  const user = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSingleProjectDetails();
  }, []);

  const fetchSingleProjectDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/project/single/${projectId}`, {
        withCredentials: true,
      });
      dispatch(addProject(res?.data?.data));
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/task/create`,
        {
          title: taskTitle,
          description: taskDescription,
          projectId: project._id,
        },
        { withCredentials: true }
      );
      setTaskTitle('');
      setTaskDescription('');
      dispatch(addTask(res?.data?.data));
      toast.success(res?.data?.msg);
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = (id) => {
    if (expandedTask !== id) {
      const task = project.tasks.find((task) => task._id === id);
      setEditTaskData({ title: task.title, description: task.description });
      if (!task.readBy.includes(user._id)) {
        readTheTask(id);
      }
    }
    setExpandedTask(expandedTask === id ? null : id);
  };

  const readTheTask = async (taskId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/task/read`,
        { taskId },
        { withCredentials: true }
      );
      dispatch(updateTask(res?.data?.data));
      toast.success(res?.data?.msg);
    } catch (error) {
      console.error('Failed to mark task as read');
    }
  };

  const handleTaskUpdate = async (taskId, updatedFields) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/task/update/${taskId}`,
        updatedFields,
        { withCredentials: true }
      );
      dispatch(updateTask(res?.data?.data));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/task/delete`, {
        data: { taskId },
        withCredentials: true,
      });

      console.log("Task id is; ", taskId);
      dispatch(deleteTask(taskId));
      toast.success(res?.data?.msg);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (!project) return null;

  return (
    <div className="bg-gray-900 text-white px-6 py-10 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-300 mb-8">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
           {project.tasks.length > 0 ? project.tasks.map((task) => (
            <div key={task._id} className="mb-4 border border-gray-700 rounded-lg">
              <div
                className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-t-lg"
                onClick={() => toggleTask(task._id)}
              >
                <div className="flex justify-between items-center">
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-400">{task.status}</span>
                </div>
              </div>
              {expandedTask === task._id && (
                <div className="px-4 py-3 bg-gray-800 rounded-b-lg space-y-3">
                  <input
                    type="text"
                    value={editTaskData.title}
                    onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                    className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
                  />
                  <textarea
                    value={editTaskData.description}
                    onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                    className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskUpdate(task._id, { status: e.target.value })}
                      className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                    >
                      <option value="created">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="testing">Testing</option>
                      <option value="deployed">Deployed</option>
                    </select>
                    <button
                      onClick={() =>
                        handleTaskUpdate(task._id, {
                          title: editTaskData.title,
                          description: editTaskData.description,
                        })
                      }
                      className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-sm text-red-400 hover:text-red-300 ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : "No tasks found"}
        </div>

        {/* Side Panel: Members + Add Task */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">
              Project Members ({project.assignedTo.length}) - Created by: {project.createdBy.name}
            </h2>
            <ul className="space-y-2">
              {project.assignedTo.map((member) => (
                <li key={member._id} className="text-gray-300">
                  {member.name} — <span className="text-gray-400">{member.country}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task Title"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task Description"
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProject;
