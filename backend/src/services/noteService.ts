


//noteService

import Note, { INote } from "../models/Note";

// Create a new note
export const createNote = async (data: Partial<INote>) => {
  // If audioUrl exists, mark it
  if (data.audioUrl) data.content = data.content || "Audio Note";
  return await Note.create(data);
};

// Get all notes, sorted by latest update
export const getAllNotes = async () => await Note.find().sort({ updatedAt: -1 });

// Get note by ID
export const getNoteById = async (id: string) => await Note.findById(id);

// Update note by ID
export const updateNote = async (id: string, data: Partial<INote>) =>
  await Note.findByIdAndUpdate(id, data, { new: true });

// Delete note by ID
export const deleteNote = async (id: string) => await Note.findByIdAndDelete(id);

// Search notes by query
export const searchNotes = async (q: string) =>
  await Note.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ],
  });
