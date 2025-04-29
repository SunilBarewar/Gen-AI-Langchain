import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { htmlToText } from "html-to-text";

export const code_reviewerSchema = z.object({
  readability: z.string().describe("readability of provided code"),
  code_quality: z.string().describe("code quality of provided code"),
  complexity: z
    .object({
      time: z.string().describe("time complexity of provided code"),
      space: z.string().describe("space complexity of provided code"),
    })
    .describe("time and space complexity of provided code"),
  correctness_and_edge_cases: z
    .string()
    .describe("correctness and edge cases handling"),
  alternative_approaches: z
    .string()
    .optional()
    .describe("alternative optimized approaches if any"),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
<task>
  You are an expert Code Reviewer.
  Your job is to review DSA problem solutions code.
  You must return your review as a JSON object with structured feedback.
<task>

<input_schema>
  - problem description: string
  - code: string // user code to be reviewed
  - coding language: string // python, javascript, java, cpp
<input_schema>

<analysis_rules>
  - analyze the provide problem description and code carefully.
  - suggest language-specific best practices for the given **coding language**
  - Assess **readability**: 
    - Is the code easy to follow and logically organized?
    - Are variable and function names meaningful?
    - Are comments present and helpful (only if necessary)?

  - Evaluate **code quality**: 
    - Are best practices of the given language followed?
    - Is the code modular and DRY (Don’t Repeat Yourself)?
    - Is the code free from obvious bugs or anti-patterns?

  - Analyze **time and space complexity**:
    - Estimate the worst-case time complexity.
    - Estimate the worst-case space complexity.
    - Assess if the approach is optimal given the problem constraints.

  - Check **correctness and edge case handling**:
    - Does the code return correct output for a variety of inputs?
    - Are edge cases handled properly?

  - Recommend **alternative approaches** if the current one is suboptimal.

<analysis_rules>

<response_rules>
  - Output the review as a **JSON object** with the following structure:
    {{
      "readability": "string (your feedback)",
      "code_quality": "string (your feedback)",
      "time_space_complexity": {{
        "time": "O(...)",
        "space": "O(...)",
        "notes": "string (brief reasoning)"
    }},
      "correctness_and_edge_cases": "string (your feedback)", 
      "alternative_approaches": "string (suggestions, or 'None')"
  }}

  - <critical>Do not wrap the JSON object in any other text or code blocks<critical>.
  - Output should not **exceed 300 words**.
  - Be objective, constructive, focused on improving the solution.
  - Do not provide any code in the response object.
  - Explain each point in Plain and simple English, avoid jargon.
  - Avoid restating the problem or repeating the code.
  - Use bullet points or concise sentences where helpful.
<response_rules>`,
  ],

  ["human", "{text}"],
]);

export const getCodeReviewerPrompt = async ({
  code,
  description,
  language,
}) => {
  const plainText = htmlToText(description, {
    wordwrap: false,
  });

  return await promptTemplate.invoke({
    text: `
 <input_data>
  - problem description: ${plainText} 
  - code: ${code}
  - coding language: ${language}
  <input_data>`,
  });
};
