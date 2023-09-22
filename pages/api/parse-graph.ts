import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt } = req.body;
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        n: 1,
        model: "gpt-3.5-turbo",
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });
    console.log({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 10000,
        n: 1,
        model: "gpt-3.5-turbo-16k",
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });
    
    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const graphData =
      data.choices && data.choices.length > 0
        ? data.choices[0].message.content.trim()
        : null;
    if (!graphData) {
      throw new Error("Failed to generate graph data");
    }
    const stringifiedData = graphData.replace(/'/g, '"');
    console.log("🚀 ~ file: parse-graph.ts:46 ~ stringifiedData:", stringifiedData)
    res.status(200).json(stringifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the input" });
  }
}
