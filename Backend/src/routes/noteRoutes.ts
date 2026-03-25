import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getStats,
} from '../controllers/noteController';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.post('/', upload.single('image'), createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', upload.single('image'), updateNote);
router.delete('/:id', deleteNote);

export default router;
