import { openai } from "../config/openai.js";
import { Workout } from "../models/workout.mode.js";

export const generateWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gender, currentWeight, targetWeight, fitnessLevel, primaryGoal, daysPerWeek, workoutType } = req.body;

    const models = [
  "openrouter/free",                          // ✅ Auto-picks any available free model
  "meta-llama/llama-3.3-70b-instruct:free",   // ✅ Valid April 2026
  "google/gemma-3-27b-it:free",               // ✅ Valid April 2026
  "deepseek/deepseek-r1:free",                // ✅ Valid April 2026
  "mistralai/mistral-small-3.1-24b-instruct:free" // ✅ Valid April 2026
];

    let aiWorkoutPlan = null;

    for (let model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          max_tokens: 1500,  // ✅ Force a long response
          messages: [
            {
              role: "user",
              content: `Create a DETAILED personalized workout plan for:
              - Gender: ${gender}
              - Current Weight: ${currentWeight} kg
              - Target Weight: ${targetWeight} kg
              - Fitness Level: ${fitnessLevel}
              - Primary Goal: ${primaryGoal}
              - Days Per Week: ${daysPerWeek}
              - Preferred Workout Type: ${workoutType}

              You are their long-time gym buddy who genuinely cares about their progress.
              Be thorough, warm, and encouraging throughout.

              Structure your response exactly like this:

              👋 PERSONAL NOTE
              Write a friendly personalized message about their ${currentWeight}kg to ${targetWeight}kg journey. Make it emotional and motivating.

              📅 WEEKLY SCHEDULE OVERVIEW
              List all ${daysPerWeek} workout days and what muscle groups or focus each day targets.

              🏋️ DAY-BY-DAY BREAKDOWN
              For each workout day provide:
              - Day name and focus
              - 5 minute warm-up routine (specific movements)
              - 6 to 8 exercises with sets, reps, and rest time
              - 5 minute cool-down routine (specific stretches)

              💡 LEVEL-SPECIFIC TIPS
              Give 5 detailed tips specifically for someone at the ${fitnessLevel} level chasing ${primaryGoal}.

              🍽️ NUTRITION SYNC
              Brief advice on eating around workouts to support the ${primaryGoal} goal.

              🔥 CLOSING MOTIVATION
              End with a powerful personalized motivational paragraph addressing their specific journey.`
            }
          ]
        });

        aiWorkoutPlan = completion.choices[0]?.message?.content;
        console.log(`✅ Model succeeded: ${model}`);  // ✅ Know which model worked
        break;
      } catch (err) {
        // ✅ Now you'll actually see what's going wrong
        console.log(`❌ Model ${model} failed — Status: ${err.status} | Message: ${err.message}`);
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