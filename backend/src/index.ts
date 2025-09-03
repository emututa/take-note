




import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import speechRoutes from "./routes/speechRoutes";
import secretsRoutes from "./routes/secretsRoutes";
import noteRoutes from "./routes/noteRoutes";
import { connectToDatabase } from "./lib/dbConnect";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- API Key validation -----------------
if (!process.env.OPENAI_API_KEY) console.warn("⚠️ Missing OPENAI_API_KEY");
if (!process.env.GROQ_API_KEY) console.warn("⚠️ Missing GROQ_API_KEY");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/speech", speechRoutes);
app.use("/api/secrets", secretsRoutes);
app.use("/api/notes", noteRoutes);

// OpenAI summary route
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.post("/api/notes/summary", async (req, res) => {
  const { noteText } = req.body;
  if (!noteText) return res.status(400).json({ error: "noteText is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes notes concisely." },
        { role: "user", content: noteText },
      ],
    });
    const summary = completion.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("✅ Notes endpoints active at /api/notes");
      console.log("✅ Transcription endpoint: POST /api/notes/transcription");
    });
  })
  .catch((err) => console.error("❌ Failed to connect to database:", err));
