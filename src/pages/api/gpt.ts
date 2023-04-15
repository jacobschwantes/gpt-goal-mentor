import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { Plan } from "@/common/types/gpt";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Plan>
) {
  try {
    const { goal, interval, background } = req.body;
    const plan = await createPlan(goal, interval, background);
    res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    res.status(200).json({ goal: "", timeframe: "", plan: [] });
  }
}

const SYSTEM = `You are a goal mentor that will take a users background, their goal and a timeframe and create a very specific actionable plan to help them reach their goal. You will create an outline of larger steps and then create smaller sub goals and then within those sub goals create very specific actionable tasks for the user to accomplish. Do not leave room for the user to make their own decisions about which specific tasks to complete, you must provide those tasks for them. Your repsonse MUST be formated as JSON in the format {"goal": String, "timeframe": String, "plan": [{"step": String, "subtasks": [{"task": String, "count": Number, "interval": String}]}]}. Do not return any non-json text or numbering. The count refers to the frequency the task should be completed in the specified interval. The interval can be one of the following: "per day", "per week", "per month", "per year". Do not include the interval or frequency in the task description itself. The count and interval properties should be used to denote frequency.`;

export const createPlan = async (
  goal: string,
  interval: string,
  background: string
) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `${background} and my goal is ${goal} and I want to reach it in ${interval}`,
        },
      ],
    })
    .then((response) => {
      const data = response.data.choices[0].message?.content;
      const cleaned = data && data.replace(/(\r\n|\n|\r)/gm, "");
      return JSON.parse(cleaned || "");
    })
    .catch((error) => {
      console.log(error);
    });
  return response;
};
