import { openai } from "../config/openai.js";
import { BMI } from "../models/Bmi.model.js";



export const addBmi = async(req,res)=>{
    try{
    const userId = req.user.id
    const {age,gender,height,weight} = req.body;
    const heightInMeters = height / 100;
    const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

     const models = [
 "meta-llama/llama-3.2-3b-instruct:free",
 "qwen/qwen2-7b-instruct:free",
 "deepseek/deepseek-chat:free",
 "mistralai/mistral-7b-instruct:free",
 "nousresearch/hermes-2-pro-llama-3-8b:free"
];

    let aiInsight = null;

    for (let model of models) {
      try {
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "user",
              content: `A user has BMI ${calculatedBmi}, age ${age}, gender ${gender}. 
             Give short health insights including:
           - BMI category
            - Health risk
           - Diet advice
            - Workout advice
            make it extreemely insightfull and engaging 
            behave as if user is ur loong existing friend 
            be friendly

          Keep it under 300 words.`
            }
          ]
        });

        aiInsight = completion.choices[0].message.content;
        break;
      } catch (err) {
        console.log(`Model ${model} failed`);
      }
    }

    if (!aiInsight) {
      aiInsight = `Your BMI is ${calculatedBmi}. Maintain a balanced diet, regular exercise, and good sleep habits to stay healthy.`;
    }
    
    const bmi = await BMI.create({
        userId,
        age,
        gender,
        height,
        weight,
        bmiValue:calculatedBmi,
        aiInsights:aiInsight
    })

    return res.status(201).json({
        Message:"Bmi addded successfuly",
        bmi
    })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Sevrer Error"
        })
    }
    
}

export const getBmi = async(req,res)=>{
    try{
    const userId = req.user.id;
    const bmi = await BMI.find({userId});
    if (bmi.length === 0) {
            return res.status(404).json({           
                message: "No BMI records found for this user"
            });
        }

    return res.status(200).json({
        message:"Bmi for this user have found ",
        bmi
    })
    }catch(err){
    console.log(err);
     return res.status(500).json({
       message:"Internal Server Error"
     })
    }
     
}