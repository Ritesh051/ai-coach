import axios from "axios";
import OpenAI from "openai";
import { ExpertsList } from "./Options";

export const getToken = async () => {
  const result = await axios.get('/api/getToken');
  console.log("Token fetched successfully", result.data);
  return result.data;
}
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
})

export const AIModel = async (topic, coachOptions, message) => {
  const option = ExpertsList.find(opt => opt.name === coachOptions);
  const PROMPT = option ? option.prompt.replace('{user_topic}', topic) : "";

  try {
    const completion = await openai.chat.completions.create({
      //meta-llama/llama-3.3-8b-instruct:free
      //google/gemini-2.0-flash-exp:free
      //mistralai/mistral-7b-instruct:free
      //deepseek/deepseek-r1-0528-qwen3-8b:free
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: message }
      ],
    });

    const aiText = completion.choices?.[0]?.message?.content || "No response";
    return aiText;
  } catch (error) {
    console.error("AIModel error:", error);
    return "Error: Could not generate AI response.";
  }
};