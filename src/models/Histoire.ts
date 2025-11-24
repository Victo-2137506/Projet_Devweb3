import mongoose, { Schema, model } from 'mongoose';

export interface IHistoire {
  _id?: string;
  nom: string;
  pays: string;
  naissance: Date;
  mort?: Date | null;
  vivant: boolean;
  siecle: number;
  role: string;
  faitsMarquants: string[];
}

const ServiceHistoire = new Schema<IHistoire>({
  nom: { type: String, required: true },
  pays: { type: String, required: true },
  naissance: { type: Date, required: true },
  mort: { type: Date, default: null },
  vivant: { type: Boolean, required: true },
  siecle: { type: Number, required: true },
  role: { type: String, required: true },
  faitsMarquants: { type: [String], required: true },
});

mongoose.pluralize(null);

export const Histoire = model<IHistoire>('histoire', ServiceHistoire);
