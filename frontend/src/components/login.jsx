import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/slices/userSlice";
import { BASE_URL } from "../constants/constants";

const Login = () => {
  // state variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  // it is used to dispatch an action which changes the state of our store
  const dispatch = useDispatch();
  // navigate to different routes in our application
  const navigate = useNavigate();

  // handle the login
  const handleLogin = async () => {
    try {
      // API call for user login
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // add login user to the store
      dispatch(addUser(res.data.data));
      setError("");

      // redirect to / page
      return navigate("/");
    } catch (error) {
      // set error message
      setError(error.response.data);
    }
  };

  // handle sign up
  const handleSignup = async () => {
    try {
      // API call for user signup
      const res = await axios.post(
        `${BASE_URL}/auth/register`,
        {
          name: fullName,
          country,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // add signup user to the store
      dispatch(addUser(res?.data?.data));
      setError("");

      // redirect to / page
      return navigate("/");
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-800 rounded-lg shadow-xl min-w-[400px] p-8 border border-gray-700">
        <div className="space-y-6">
          {/* heading */}
          <h2 className="text-2xl font-bold text-center text-white">
            {isLoginForm ? "Login" : "Signup"}
          </h2>
          
          <div className="space-y-4">
            {/* First Name */}
            {!isLoginForm && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    // change the email according to user input
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                    type="text"
                    // bind input with email
                    value={fullName}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md 
                             text-white placeholder-gray-400 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Country</label>
                  <input
                    // change the email according to user input
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                    type="text"
                    // bind input with email
                    value={country}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md 
                             text-white placeholder-gray-400 focus:outline-none 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Country"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                // change the email according to user input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                // bind input with email
                value={email}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md 
                         text-white placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                // change the password according to user password
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                // bind input with password
                value={password}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md 
                         text-white placeholder-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Password"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          {/* button */}
          <div className="flex justify-center">
            <button
              onClick={isLoginForm ? handleLogin : handleSignup}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium 
                        py-2.5 px-4 rounded-md transition duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoginForm ? "Login" : "Signup"}
            </button>
          </div>

          <p
            onClick={() => setIsLoginForm(!isLoginForm)}
            className="text-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer 
                      transition duration-150 ease-in-out"
          >
            {isLoginForm
              ? "New User? Signup here"
              : "Existing User? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;