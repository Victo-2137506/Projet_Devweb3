import { IHistoire, Histoire } from '@src/models/Histoire';
import { RootFilterQuery } from 'mongoose';

/**
 * Extraire toutes les personnes historiques
 */
async function getAll(): Promise<IHistoire[]> {
  return await Histoire.find();
}

/**
 * Extraire une personne historique par son ID
 */
async function getOne(id: string): Promise<IHistoire | null> {
  return await Histoire.findById(id);
}

/**
 * Trouver des personnes selon des filtres
 */
async function getByFilters(
  query: RootFilterQuery<IHistoire>,
): Promise<IHistoire[]> {
  return await Histoire.find(query);
}

/**
 * Ajouter une personne historique
 */
async function add(histoire: IHistoire): Promise<IHistoire> {
  const nouvelleHistoire = new Histoire(histoire);
  return await nouvelleHistoire.save();
}

/**
 * Vérifie si une personne historique existe par son ID
 */
async function persists(id: string): Promise<boolean> {
  return (await Histoire.findById(id)) !== null;
}

/**
 * Mettre à jour une personne historique
 */
async function updateOne(
  id: string,
  histoire: Partial<IHistoire>,
): Promise<IHistoire | null> {
  return await Histoire.findByIdAndUpdate(id, histoire, { new: true });
}

/**
 * Supprimer une personne historique par ID
 */
async function deleteOne(id: string): Promise<void> {
  await Histoire.findByIdAndDelete(id);
}

export default {
  persists,
  getAll,
  getOne,
  getByFilters,
  add,
  updateOne,
  deleteOne,
} as const;
