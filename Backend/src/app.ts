import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
