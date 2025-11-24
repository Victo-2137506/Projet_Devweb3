import { Router, Request, NextFunction, Response } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import Paths from '@src/common/constants/Paths';
import HistoireRoutes from './HistoireRoute';
import UserRoutes from './UserRoutes';
import JetonRoutes from './JetonRoutes';

import { Histoire } from '@src/models/Histoire';

/****************************************************************************** 
                                Setup
******************************************************************************/

// ** Validation d'une histoire ** //
function validateHistoire(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Histoire requise' })
      .end();
    return;
  }

  if (!req.body.histoire) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Histoire requise' })
      .end();
    return;
  }

  const nouvelleHistoire = new Histoire(req.body.histoire);
  const error = nouvelleHistoire.validateSync();
  if (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  } else {
    next();
  }
}

// ** Ajout des router ** //
const apiRouter = Router();
const histoireRouter = Router();
const tokenRouter = Router();
const userRouter = Router();

// ** Ajout des chemins pour les router ** //
apiRouter.use(Paths.Histoire.Base, histoireRouter);
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);
apiRouter.use(Paths.Users.Base, userRouter);

// ** Route pour les personnes historiques ** //
histoireRouter.get(Paths.Histoire.GetAll, HistoireRoutes.getAll);
histoireRouter.get(Paths.Histoire.GetByFilter, HistoireRoutes.getByFilters);
histoireRouter.get(Paths.Histoire.GetOne, HistoireRoutes.getOne);
histoireRouter.post(Paths.Histoire.Add, validateHistoire, HistoireRoutes.add);
histoireRouter.put(Paths.Histoire.Update, HistoireRoutes.updateOne);
histoireRouter.delete(Paths.Histoire.Delete, HistoireRoutes.deleteOne);

// ** Route pour générer un token ** //
tokenRouter.get(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// ** Route pour l'utilisateur ** //
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// **** Export default **** //
export default apiRouter;
