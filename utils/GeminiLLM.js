import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Base LLM class for Gemini integration
 */
export class GeminiLLM {
  /**
   * @param {Object} config - Configuration for Gemini model
   * @param {string} config.apiKey - Google API Key
   * @param {string} config.model - Gemini model to use (defaults to gemini-pro)
   * @param {number} config.temperature - Temperature setting (0-1)
   * @param {number} config.maxOutputTokens - Maximum output tokens
   */
  constructor(config) {
    this.config = {
      model: "gemini-pro",
      temperature: 0,
      maxOutputTokens: 2048,
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error("API Key is required for Gemini integration");
    }

    this.llm = new ChatGoogleGenerativeAI({
      apiKey: this.config.apiKey,
      model: this.config.model,
      temperature: this.config.temperature,
      maxOutputTokens: this.config.maxOutputTokens,
    });
  }

  /**
   * Get the underlying LLM instance
   * @returns {ChatGoogleGenerativeAI} The LLM instance
   */
  getLLM() {
    return this.llm;
  }
}
