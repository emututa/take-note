






import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import SecretsPassword from "../models/SecretsPassword";

// ------------------------------
// Check if password exists
// ------------------------------
export const checkPassword = async (_req: Request, res: Response) => {
  try {
    const existing = await SecretsPassword.findOne();
    res.json({ hasPassword: !!existing });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// Set password (only if not exists)
// ------------------------------
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password required" });

    const existing = await SecretsPassword.findOne();
    if (existing) {
      return res.status(400).json({ error: "Password already set. Use change-password instead." });
    }

    const hash = await bcrypt.hash(password, 10);
    const doc = new SecretsPassword({ passwordHash: hash });
    await doc.save();

    res.status(201).json({ message: "Password set successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// Verify password
// ------------------------------
export const verifyPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const existing = await SecretsPassword.findOne();
    if (!existing) return res.status(400).json({ error: "No password set yet" });

    const valid = await bcrypt.compare(password, existing.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    res.json({ success: true, message: "Password verified" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------
// Change password
// ------------------------------
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Both old and new passwords are required" });

    const existing = await SecretsPassword.findOne();
    if (!existing) return res.status(400).json({ error: "No password set yet" });

    const valid = await bcrypt.compare(oldPassword, existing.passwordHash);
    if (!valid) return res.status(401).json({ error: "Old password incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    existing.passwordHash = newHash;
    await existing.save();

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
