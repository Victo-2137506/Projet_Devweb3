import HistoireRepo from '@src/repos/HistoireRepo';
import { IHistoire } from '@src/models/Histoire';

// Le code est inspiré des notes de cours : https://web3.profinfo.ca/projet_complet_mongoose/

/******************************************************************************
                                Constantes
******************************************************************************/

export const PERSONNE_NOT_FOUND_ERR = 'Personne non trouvée';
export const CHAMP_MANQUANT_ERR = 'Certains champs obligatoires sont manquants';
export const DONNEES_INVALIDES_ERR = 'Les données fournies sont invalides';

/******************************************************************************
                                Fonctions
******************************************************************************/

/**
 * Lire toutes les personnes historiques
 */
function getAll(): Promise<IHistoire[]> {
  return HistoireRepo.getAll();
}

/**
 * Lire une personne historique par son ID
 */
async function getOne(id: string): Promise<IHistoire> {
  const histoire = await HistoireRepo.getOne(id);
  if (!histoire) {
    throw new Error(PERSONNE_NOT_FOUND_ERR);
  }
  return histoire;
}

/**
 * Rechercher des personnes historiques par filtres
 */
async function getByFilters(
  pays?: string,
  siecle?: number,
): Promise<IHistoire[]> {
  const query: { pays?: string; siecle?: number } = {};
  if (pays) query.pays = pays;
  if (siecle) query.siecle = siecle;

  return HistoireRepo.getByFilters(query);
}

/**
 * Ajouter une personne historique
 */
async function addOne(histoire: IHistoire): Promise<IHistoire> {
  if (
    !histoire.nom ||
    !histoire.pays ||
    !histoire.naissance ||
    histoire.vivant === undefined
  ) {
    throw new Error(CHAMP_MANQUANT_ERR);
  }

  // Validation cohérence dates
  if (histoire.mort && new Date(histoire.mort) < new Date(histoire.naissance)) {
    throw new Error(
      'La date de décès ne peut pas être antérieure à la date de naissance',
    );
  }

  // Validation siècle
  if (histoire.siecle < 1 || histoire.siecle > 21) {
    throw new Error('Le siècle doit être compris entre le 1er et 21ème');
  }

  return await HistoireRepo.add(histoire);
}

/**
 * Mettre à jour une personne historique
 */
async function updateOne(id: string, histoire: IHistoire): Promise<IHistoire> {
  const existe = await HistoireRepo.persists(id);
  if (!existe) {
    throw new Error(PERSONNE_NOT_FOUND_ERR);
  }

  const updated = await HistoireRepo.updateOne(id, histoire);
  if (!updated) {
    throw new Error(DONNEES_INVALIDES_ERR);
  }
  return updated;
}

/**
 * Supprimer une personne historique
 */
async function deleteOne(id: string): Promise<void> {
  const existe = await HistoireRepo.persists(id);
  if (!existe) {
    throw new Error(PERSONNE_NOT_FOUND_ERR);
  }
  await HistoireRepo.deleteOne(id);
}

/******************************************************************************
                                Export par défaut
******************************************************************************/

export default {
  getAll,
  getOne,
  getByFilters,
  addOne,
  updateOne,
  deleteOne,
} as const;
