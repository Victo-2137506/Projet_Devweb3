import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IReq, IRes } from './common/types';
import HistoireService from '@src/services/HistoireService';
import { IHistoire } from '@src/models/Histoire';

/* eslint-disable */

// **** Functions **** //
/**
 * Extraire toutes les personnages historique
 */
async function getAll(_: IReq, res: IRes) {
  const histoires = await HistoireService.getAll();
  return res.status(HttpStatusCodes.OK).json({ histoires });
}

/**
 * Extraire une personne historique par son ID
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const histoire = await HistoireService.getOne(id as string);
  return res.status(HttpStatusCodes.OK).json({ histoire });
}

/**
 * Rechercher des personnes selon des filtres
 */
async function getByFilters(req: IReq, res: IRes) {
  const { pays, siecle } = req.query;

  const resultat = await HistoireService.getByFilters(
    pays ? String(pays) : undefined,
    siecle ? Number(siecle) : undefined,
  );

  return res.status(HttpStatusCodes.OK).json({ histoires: resultat });
}

/**
 * Ajouter une personne historique
 */
async function add(req: IReq, res: IRes) {
  const { histoire } = req.body;
  const nouvellePersonne = await HistoireService.addOne(histoire as IHistoire);
  return res.status(HttpStatusCodes.CREATED).json({ id: nouvellePersonne._id });
}

/**
 * Mettre à jour une personne historique
 */
async function updateOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const { histoire } = req.body;
  await HistoireService.updateOne(id as string, histoire as IHistoire);
  return res.status(HttpStatusCodes.OK).end('La personne à bien été modifiée');
}

/**
 * Supprimer une personne historique
 */
async function deleteOne(req: IReq, res: IRes) {
  const { id } = req.params;
  await HistoireService.deleteOne(id as string);
  return res.status(HttpStatusCodes.OK).end('La personne à bien été supprimée');
}
// **** Export default **** //

export default {
  getAll,
  getOne,
  getByFilters,
  add,
  updateOne,
  deleteOne,
} as const;
