import { input_data, promptTemplate } from "./prompts/CodeAssistant.prompt.js";
import { GeminiLLM } from "./utils/GeminiAiService.js";

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

    // const prompt = await promptTemplate.invoke({
    //   text: input_data,
    // });

    const response = await llm.invoke(prompt);

    console.log(response.content);
    return response;
  }
}

export default AICodeAssistant;
