import axios from "axios";

// Assume the backend is running on port 5000 from the backend index.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookie-parser in auth
});

// Auth Routes
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/signin", { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  // Backend expects 'username', not 'name'
  const response = await api.post("/auth/signup", { username: name, email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// User Profile
export const getUserProfile = async () => {
  const response = await api.get("/user/getuser");
  return response.data;
};

// BMI Routes
export const calculateBMI = async (age, gender, height, weight) => {
  const response = await api.post("/bmi/addbmi", { age, gender, height, weight });
  return response.data;
};
export const getBMIHistory = async () => {
  const response = await api.get("/bmi/getbmi");
  return response.data;
};

// Workout Routes
export const generateWorkout = async (data) => {
  // data: { gender, currentWeight, targetWeight, fitnessLevel, primaryGoal, daysPerWeek, workoutType }
  const response = await api.post("/workout/generateworkout", data);
  return response.data;
};
export const getWorkoutHistory = async () => {
    const response = await api.get("/workout/getworkouts");
    return response.data;
};

// Sleep Routes
export const logSleep = async (data) => {
  // data: { amount, qualityLevel, wakingMood, text, date }
  const response = await api.post("/sleep/addsleep", data);
  return response.data;
};
export const getSleepHistory = async () => {
  const response = await api.get("/sleep/getsleepdata");
  return response.data;
};

export default api;
