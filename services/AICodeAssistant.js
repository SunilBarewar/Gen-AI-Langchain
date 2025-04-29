import { code_reviewerSchema } from "../prompts/CodeReviewer.prompt.js";
import { GeminiLLM } from "../utils/GeminiLLM.js";
import { TokenUsageCallbackHandler } from "../utils/TokenUsageCallbackHandler.js";

class AICodeAssistant {
  constructor() {
    this.llm = new GeminiLLM({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-pro",
      temperature: 0.1,
    });
  }

  async getAiResponse(prompt) {
    const llm = this.llm.getLLM();

    const response = await llm.invoke(prompt);

    return response;
  }

  async getCodeReviewerResponse(prompt) {
    const structured_llm = this.llm
      .getLLM()
      .withStructuredOutput(code_reviewerSchema);

    const usageHandler = new TokenUsageCallbackHandler();

    const response = await structured_llm.invoke(prompt, {
      callbacks: [usageHandler],
    });

    const usageData = usageHandler.getUsageData();

    return { response, usageData };
  }
}

export default AICodeAssistant;
