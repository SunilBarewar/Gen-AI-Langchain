import express from "express";
import cors from "cors";
import { config } from "dotenv";
import AICodeAssistant from "./services/AICodeAssistant.js";
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
const data = {
  description:
    "<p><strong>Problem Statement:</strong></p><p>Given an array nums containing only 0s, 1s, and 2s, your task is to sort the array in ascending order.</p><p><br></p><p><strong>Constraints:</strong></p><ul><li>1 &lt;= nums.length &lt;= 10^5</li><li>nums[i] is either 0, 1, or 2.</li></ul><p><br></p><p><strong>Input Format:</strong></p><ul><li>An integer n representing the size of the array.</li><li>n space-separated integers representing the elements of the array (0s, 1s, and 2s).</li></ul><p><br></p><p><strong>Output Format:</strong></p><ul><li>Output an array representing the sorted array in ascending order.</li></ul><p><br></p><p><strong>Examples:</strong></p><p><em>Input:</em></p><p>Array: 2 0 2 1 1 0</p><p>Output : 0 0 1 1 2 2</p><p><em>Explanation:</em> After sorting the array, the elements are arranged in ascending order: [0, 0, 1, 1, 2, 2].</p>",
  code: "\nclass Solution {\npublic:\n    vector<int> sortArray(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n\n        return nums\n    }\n};\n",
  language: "cpp",
};
app.post("/api/code-reviewer", async (req, res) => {
  const prompt = await getCodeReviewerPrompt(data);

  const response = await codeAssistant.getCodeReviewerResponse(prompt);

  return res.status(200).json({
    success: true,
    message: "Code Reviewer response",
    data: response,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
