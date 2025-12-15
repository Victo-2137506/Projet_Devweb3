import mongoose, { Schema, model } from 'mongoose';

// Le code est inspiré des notes de cours : https://web3.profinfo.ca/projet_complet_mongoose/

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
  nom: { type: String, required: [true, 'Le nom est obligatoire'] },
  pays: { type: String, required: [true, 'Le pays est obligatoire'] },
  naissance: {
    type: Date,
    required: [true, 'La date de naissance est obligatoire'],
  },
  mort: { type: Date, default: null },
  vivant: {
    type: Boolean,
    required: [true, 'Savoir si il est vivant ou non est obligatoire'],
  },
  siecle: { type: Number, required: [true, 'Le siècle est obligatoire'] },
  role: { type: String, required: [true, 'Le rôle est obligatoire'] },
  faitsMarquants: {
    type: [String],
    required: [true, 'Un ou des faits marquants est obligatoire'],
  },
});

mongoose.pluralize(null);

export const Histoire = model<IHistoire>('histoire', ServiceHistoire);
