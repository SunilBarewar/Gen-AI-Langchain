import { ChatPromptTemplate } from "@langchain/core/prompts";

import { htmlToText } from "html-to-text";

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
<task>
  You are an expert Code Reviewer.
  Your job is to review DSA problem solutions written in code.
  You must return your review as a JSON object with structured feedback.
<task>

<input_schema>
  - problem description: string
  - code: string // user code to be reviewed
  - coding language: string // python, javascript, java, c++
<input_schema>

<analysis_rules>
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
    {
      "readability": "string (your feedback)",
      "code_quality": "string (your feedback)",
      "time_space_complexity": {
        "time": "O(...)",
        "space": "O(...)",
        "notes": "string (brief reasoning)"
      },
      "correctness_and_edge_cases": "string (your feedback)", 
      "alternative_approaches": "string (suggestions, or 'None')", 
    }

  - Output should not *exceed 300 words*.
  - Be objective, constructive, focused on improving the solution.
  - Do not provide any code in the response object.
  - Explain each point in Plain and simple English, avoiding jargon.
  - Avoid restating the problem or repeating the code.
  - Use bullet points or concise sentences where helpful.
<response_rules>`,
  ],

  ["human", "{text}"],
]);

const data = {
  description:
    "<p><strong>Problem Statement:</strong></p><p>Given an array nums containing only 0s, 1s, and 2s, your task is to sort the array in ascending order.</p><p><br></p><p><strong>Constraints:</strong></p><ul><li>1 &lt;= nums.length &lt;= 10^5</li><li>nums[i] is either 0, 1, or 2.</li></ul><p><br></p><p><strong>Input Format:</strong></p><ul><li>An integer n representing the size of the array.</li><li>n space-separated integers representing the elements of the array (0s, 1s, and 2s).</li></ul><p><br></p><p><strong>Output Format:</strong></p><ul><li>Output an array representing the sorted array in ascending order.</li></ul><p><br></p><p><strong>Examples:</strong></p><p><em>Input:</em></p><p>Array: 2 0 2 1 1 0</p><p>Output : 0 0 1 1 2 2</p><p><em>Explanation:</em> After sorting the array, the elements are arranged in ascending order: [0, 0, 1, 1, 2, 2].</p>",
  code: "\nclass Solution {\npublic:\n    vector<int> sortArray(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n\n        return nums\n    }\n};\n",
  language: "cpp",
};

export const getCodeReviewerPrompt = async ({
  code,
  description,
  language,
}) => {
  const plainText = htmlToText(data.description, {
    wordwrap: false, // Prevent unwanted line breaks
  });

  console.log(plainText);
  return await promptTemplate.invoke({
    text: `
 <input_data>
  - problem description: ${plainText} 
  - code: ${data.code}
  - coding language: ${data.language}
  <input_data>`,
  });
};
