import { openai } from "../config/openai.js";
import { Sleep } from "../models/sleep.model.js";

export const addSleep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, qualityLevel, wakingMood, text,date } = req.body;

    const models = [
      "openrouter/free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-3-27b-it:free",
      "deepseek/deepseek-r1:free",
      "mistralai/mistral-small-3.1-24b-instruct:free"
    ];

    let aiInsight = null;

    for (let model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `Analyze the sleep data of your close friend and give them detailed insights:
              - Hours Slept: ${amount}
              - Sleep Quality: ${qualityLevel} / 10
              - Waking Mood: ${wakingMood}
              - Their Note: "${text}"

              You are their caring long-time friend who genuinely wants them to sleep better.
              Be warm, personal, and reference their specific data throughout.

              Structure your response exactly like this:

              😴 SLEEP SUMMARY
              A friendly personalized analysis of their ${amount} hours of sleep at quality ${qualityLevel}/10. Tell them honestly how they did.

              🧠 WHAT YOUR BODY WENT THROUGH
              Explain in simple engaging terms what actually happened to their body and brain during this sleep session based on the hours and quality.

              ⚠️ HEALTH IMPACT
              Based on their quality score of ${qualityLevel}/10 and waking mood of "${wakingMood}", explain the short and long term health impacts they should know about.

              🌙 WHY YOU FELT "${wakingMood}"
              Explain exactly why they woke up feeling ${wakingMood} based on their sleep data. Make it feel like an "aha moment".

              💡 TONIGHT'S ACTION PLAN
              Give 5 specific, actionable tips to improve their sleep tonight based on their data. Not generic advice — tailored to their ${qualityLevel}/10 quality and ${amount} hours.

              ☀️ MAKING THE MOST OF TODAY
              Since they slept ${amount} hours and woke up ${wakingMood}, give practical advice on how to manage their energy levels throughout today.

              🔥 CLOSING PEP TALK
              End with a warm motivating message that references their specific sleep data and encourages them to build better sleep habits.`
            }
          ]
        });

        aiInsight = completion.choices[0]?.message?.content;
        console.log(`✅ Model succeeded: ${model}`);
        break;
      } catch (err) {
        console.log(`❌ Model ${model} failed — Status: ${err.status} | Message: ${err.message}`);
      }
    }

    if (!aiInsight) {
      aiInsight = `You slept ${amount} hours with a quality of ${qualityLevel}/10 and woke up feeling ${wakingMood}. 
      Try to maintain a consistent sleep schedule, avoid screens before bed, and aim for 7-9 hours of quality sleep each night.`;
    }

    const sleep = await Sleep.create({
      userId,
      amount,
      qualityLevel,
      wakingMood,
      text,
      aiInsights: aiInsight,
      date
    });

    return res.status(201).json({
      message: "Sleep log added successfully",
      sleep
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getSleep = async (req, res) => {
  try {
    const userId = req.user.id;
    const sleepLogs = await Sleep.find({ userId }).sort({ createdAt: -1 });

    if (sleepLogs.length === 0) {
      return res.status(404).json({
        message: "No sleep logs found for this user"
      });
    }

    return res.status(200).json({
      message: "Sleep logs fetched successfully",
      sleepLogs
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};