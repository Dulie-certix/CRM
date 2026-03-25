import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (id: string, email: string, name: string) =>
  jwt.sign({ id, email, name }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields required' });
    return;
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }
  const user = await User.create({ name, email, password });
  const token = signToken(String(user._id), user.email, user.name);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = signToken(String(user._id), user.email, user.name);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select('-password');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
};
