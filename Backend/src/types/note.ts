export type NoteStatus = 'pending' | 'completed';

export interface INote {
  title: string;
  description: string;
  status: NoteStatus;
  image?: string;
  dueDate?: Date;
  assignedTo: string;
}
