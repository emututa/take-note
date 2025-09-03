




// src/controllers/noteController.ts
import { Request, Response } from "express";
import OpenAI from "openai";
import fs from "fs";
import Note from "../models/Note"; // adjust to your schema

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ----------------- CRUD -----------------
export const create = async (req: Request, res: Response) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (_: Request, res: Response) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const notes = await Note.find({ content: new RegExp(q as string, "i") });
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- AUDIO -----------------
export const saveAudio = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });
  res.json({ message: "Audio file saved", filename: req.file.filename });
};

export const transcribe = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "gpt-4o-mini-transcribe", // ✅ OpenAI transcription model
    });

    res.json({ text: transcription.text });
  } catch (err: any) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: err.message || "Transcription failed" });
  }
};
