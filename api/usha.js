
// ============================================================
// USHA AI — Secure Serverless Backend
// SNK IT Institute
// Step 5.2
// ============================================================

export default async function handler(req, res) {

  // ----------------------------------------------------------
  // 1. Only allow POST requests
  // ----------------------------------------------------------
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed."
    });
  }

  // ----------------------------------------------------------
  // 2. Check API key
  // ----------------------------------------------------------
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OPENAI_API_KEY is missing.");

    return res.status(500).json({
      success: false,
      error: "AI service is not configured yet."
    });
  }

  // ----------------------------------------------------------
  // 3. Read request body
  // ----------------------------------------------------------
  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid message."
    });
  }

  // ----------------------------------------------------------
  // 4. Limit extremely large messages
  // ----------------------------------------------------------
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return res.status(400).json({
      success: false,
      error: "Message cannot be empty."
    });
  }

  if (cleanMessage.length > 8000) {
    return res.status(400).json({
      success: false,
      error: "Message is too long."
    });
  }

  // ----------------------------------------------------------
  // 5. USHA personality / system instructions
  // ----------------------------------------------------------
  const systemPrompt = `
You are USHA, the AI Learning Assistant of SNK IT Institute.

Your main purpose is to help students learn.

PRIMARY LANGUAGE:
English is the primary language.

You may understand and respond in Bengali when the student asks
in Bengali or requests Bengali.

YOUR TEACHING STYLE:
- Friendly
- Clear
- Patient
- Beginner-friendly
- Practical
- Step-by-step
- Encouraging

MAIN LEARNING AREAS:
- Computer Basics
- HTML
- CSS
- JavaScript
- Web Development
- Programming
- Study Planning
- Practice
- Quizzes
- Learning Roadmaps

WHEN EXPLAINING:
1. Explain the concept simply.
2. Give a practical example when useful.
3. Break difficult topics into smaller steps.
4. Give a small practice task when appropriate.
5. Encourage the student to try it themselves.

IMPORTANT:
- Do not pretend to know private student information.
- Do not claim that a student completed a course unless that
  information is actually provided.
- Do not invent SNK Institute course schedules or policies.
- If information about SNK Institute is not provided, say that
  the student should check the official SNK Institute resources.
- Keep answers useful and reasonably concise.
- For coding questions, provide clean examples and explain them.
`;

  // ----------------------------------------------------------
  // 6. Prepare conversation history
  // ----------------------------------------------------------
  const safeHistory = Array.isArray(history)
    ? history
        .filter(item =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string"
        )
        .slice(-12)
        .map(item => ({
          role: item.role,
          content: item.content.slice(0, 6000)
        }))
    : [];

  // ----------------------------------------------------------
  // 7. Build Responses API input
  // ----------------------------------------------------------
  const input = [
    {
      role: "developer",
      content: systemPrompt
    },
    ...safeHistory,
    {
      role: "user",
      content: cleanMessage
    }
  ];

  try {

    // --------------------------------------------------------
    // 8. Send request to OpenAI Responses API
    // --------------------------------------------------------
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: input,
          max_output_tokens: 1200
        })
      }
    );

    // --------------------------------------------------------
    // 9. Read API response
    // --------------------------------------------------------
    const data = await response.json();

    // --------------------------------------------------------
    // 10. Handle OpenAI error
    // --------------------------------------------------------
    if (!response.ok) {

      console.error("OpenAI API error:", data);

      return res.status(500).json({
        success: false,
        error: "USHA could not connect to the AI service."
      });
    }

    // --------------------------------------------------------
    // 11. Extract response text
    // --------------------------------------------------------
    const answer =
      data.output_text ||
      "";

    if (!answer.trim()) {

      return res.status(500).json({
        success: false,
        error: "The AI returned an empty response."
      });
    }

    // --------------------------------------------------------
    // 12. Return answer to frontend
    // --------------------------------------------------------
    return res.status(200).json({
      success: true,
      answer: answer.trim()
    });

  } catch (error) {

    console.error("USHA backend error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong while connecting to USHA."
    });
  }
}
```
