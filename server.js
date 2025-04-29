import express from "express";
import cors from "cors";
import { config } from "dotenv";
import AICodeAssistant from "./AICodeAssistant.js";
import { getCodeAssistantPrompt } from "./prompts/CodeAssistant.prompt.js";
import { getCodeReviewerPrompt } from "./prompts/CodeReviewer.prompt.js";

config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const codeAssistant = new AICodeAssistant();

// codeAssistant.getAiResponse();

app.post("/api/ai-assistant", async (req, res) => {
  const prompt = await getCodeAssistantPrompt(req.body);
  console.log(req.body);
  const response = await codeAssistant.getAiResponse(prompt);

  res.status(200).json({
    success: true,
    message: "AI Assistant response",
    content: response.content,
  });
});

app.post("/api/code-reviewer", async (req, res) => {
  const prompt = await getCodeReviewerPrompt();

  const response = await codeAssistant.getAiResponse(prompt);

  return res.status(200).json({
    success: true,
    message: "Code Reviewer response",
    content: response,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
