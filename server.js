import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Node 18+ supports global fetch

const app = express();
app.use(cors());
app.use(express.json());

// Use Railway environment variables for safety
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_KEY";

app.post("/ai", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    // Send request to Gemini API
    const response = await fetch("https://api.gemini.com/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-1.5",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI";
    res.json({ reply });
  } catch (err) {
    console.error("Error contacting Gemini API:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI proxy running on port ${port}`));
