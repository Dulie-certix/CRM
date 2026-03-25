import mongoose, { Document, Schema } from 'mongoose';
import { NoteStatus } from '../types/note';

export interface INoteDocument extends Document {
  title: string;
  description: string;
  status: NoteStatus;
  image?: string;
  dueDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
}

const NoteSchema = new Schema<INoteDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    image: { type: String },
    dueDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INoteDocument>('Note', NoteSchema);
