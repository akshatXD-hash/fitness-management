import { openai } from "../config/openai.js";
import { Workout } from "../models/workout.mode.js";


export const generateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gender, currentWeight, targetWeight, fitnessLevel, primaryGoal, daysPerWeek, workoutType } = req.body;

    const models = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "qwen/qwen2-7b-instruct:free",
      "deepseek/deepseek-chat:free",
      "mistralai/mistral-7b-instruct:free",
      "nousresearch/hermes-2-pro-llama-3-8b:free"
    ];

    let aiWorkoutPlan = null;

    for (let model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "user",
              content: `Create a personalized workout plan for a user with the following details:
              - Gender: ${gender}
              - Current Weight: ${currentWeight} kg
              - Target Weight: ${targetWeight} kg
              - Fitness Level: ${fitnessLevel}
              - Primary Goal: ${primaryGoal}
              - Days Per Week: ${daysPerWeek}
              - Preferred Workout Type: ${workoutType}

              As their fitness buddy who knows them well, provide:
              - A weekly workout schedule (day-by-day breakdown)
              - Specific exercises with sets and reps for each day
              - Warm-up and cool-down recommendations
              - Tips tailored to their fitness level and goal
              - A motivational note based on their current vs target weight journey

              Be friendly, engaging, and talk like a long-time gym buddy.
              Keep it under 500 words.`
            }
          ]
        });

        aiWorkoutPlan = completion.choices[0].message.content;
        break;
      } catch (err) {
        console.log(`Model ${model} failed`);
      }
    }

    if (!aiWorkoutPlan) {
      aiWorkoutPlan = `Here's a basic ${daysPerWeek}-day workout plan tailored for ${primaryGoal}. 
      Focus on ${workoutType} exercises, stay consistent, hydrate well, and get enough rest between sessions.`;
    }

    const workout = await Workout.create({
      userId,
      gender,
      currentWeight,
      targetWeight,
      fitnessLevel,
      primaryGoal,
      daysPerWeek,
      workoutType,
      aiWorkoutPlan
    });

    return res.status(201).json({
      message: "Workout plan generated successfully",
      workout
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });

    if (workouts.length === 0) {
      return res.status(404).json({
        message: "No workout plans found for this user"
      });
    }

    return res.status(200).json({
      message: "Workout plans fetched successfully",
      workouts
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};