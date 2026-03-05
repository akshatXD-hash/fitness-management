import mongoose from "mongoose";
import { openai } from "../config/openai.js";
openai
const BmiSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: Number,
  gender: String,
  height: Number, // Store in cm
  weight: Number, // Store in kg
  bmiValue: Number,   
  aiInsights: String, // The AI-generated feedback
  date: { type: Date, default: Date.now }
});

export const BMI = mongoose.model("BMI",BmiSchema);