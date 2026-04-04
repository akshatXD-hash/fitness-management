import mongoose from "mongoose";

const SleepSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0,
    max: 24 
  },
  
  qualityLevel: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    default: 'Good'
  },
  // Enum for waking mood
  wakingMood: {
    type: String,
    enum: ['Exhausted', 'Neutral', 'Refreshed', 'Energetic'],
    default: 'Neutral'
  },
  text: String,          
  
  aiInsights: String,
  date: { 
    type: Date, 
    required: true,          
    default: Date.now        
  }
});

export const Sleep = mongoose.model("Sleep",SleepSchema);
