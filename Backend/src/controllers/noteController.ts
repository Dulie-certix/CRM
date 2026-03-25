import { Request, Response } from 'express';
import Note from '../models/Note';

export const createNote = async (req: Request, res: Response): Promise<void> => {
  const { title, description, status, dueDate } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  const note = await Note.create({
    title,
    description,
    status: status || 'pending',
    image,
    dueDate,
    assignedTo: req.user!.id,
  });
  res.status(201).json(note);
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  const notes = await Note.find({ assignedTo: req.user!.id }).sort({ createdAt: -1 });
  res.json(notes);
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  const note = await Note.findOne({ _id: req.params.id, assignedTo: req.user!.id });
  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }
  res.json(note);
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  const { title, description, status, dueDate } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  const update: Record<string, unknown> = { title, description, status, dueDate };
  if (image) update.image = image;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, assignedTo: req.user!.id },
    update,
    { new: true, runValidators: true }
  );
  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }
  res.json(note);
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, assignedTo: req.user!.id });
  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return;
  }
  res.json({ message: 'Note deleted' });
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const [total, completed, pending] = await Promise.all([
    Note.countDocuments({ assignedTo: userId }),
    Note.countDocuments({ assignedTo: userId, status: 'completed' }),
    Note.countDocuments({ assignedTo: userId, status: 'pending' }),
  ]);
  res.json({ total, completed, pending });
};
