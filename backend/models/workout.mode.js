import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  currentWeight: {
    type: Number,
    required: true
  },
  targetWeight: {
    type: Number,
    required: true
  },
  fitnessLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  primaryGoal: {
    type: String,
    required: true
  },
  daysPerWeek: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7],
    required: [true, 'Please specify how many days per week you can workout']
  },
  workoutType: {
    type: String,
    enum: ['Gym', 'Home', 'Yoga', 'Cardio'],
    required: true
  },
  aiWorkoutPlan: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Workout = mongoose.model('Workout', WorkoutSchema);