import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

export class TokenUsageCallbackHandler extends BaseCallbackHandler {
  constructor() {
    super();
    this.tokenUsage = null;
  }

  get name() {
    return "token_usage_handler";
  }

  async handleLLMEnd(output, runId, parentRunId, tags) {
    const llmOutput = output.llmOutput;

    if (llmOutput) {
      this.tokenUsage = llmOutput?.tokenUsage || null;
    }
  }

  getUsageData() {
    return this.tokenUsage;
  }
}
