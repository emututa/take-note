


import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

const router = express.Router();

// Multer configuration
const upload = multer({ dest: "uploads/" });

// Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 🎤 POST /api/speech
router.post("/", upload.single("audio"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  try {
    // Ensure file has valid extension (.wav)
    const ext = path.extname(req.file.originalname) || ".wav";
    const tempFilePath = path.join("uploads", `${req.file.filename}${ext}`);
    fs.renameSync(req.file.path, tempFilePath);

    // Call Groq Whisper API
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      response_format: "text", // ensures plain text output
    });

    // Cleanup uploaded file
    fs.unlinkSync(tempFilePath);

    // Return plain text transcription
    res.status(200).json({ text: transcription });
  } catch (error: any) {
    console.error("Groq transcription error:", error);
    res.status(500).json({ error: error.message || "Failed to transcribe audio" });
  }
});

export default router;
