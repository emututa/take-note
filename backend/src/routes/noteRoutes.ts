


// src/routes/noteRoutes.ts
import { Router } from "express";
import * as noteController from "../controllers/noteController";
import multer from "multer";

const router = Router();

// Configure Multer for audio uploads (saves to uploads/ folder)
const upload = multer({ dest: "uploads/" });

// Note CRUD
router.post("/", noteController.create);
router.get("/", noteController.getAll);
router.get("/search", noteController.search);
router.get("/:id", noteController.getById);
router.put("/:id", noteController.update);
router.delete("/:id", noteController.deleteNote);

// Audio routes
router.post("/audio-save", upload.single("audio"), noteController.saveAudio);
router.post("/transcription", upload.single("audio"), noteController.transcribe);

export default router;
