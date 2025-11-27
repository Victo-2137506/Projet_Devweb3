import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ENV from '@src/common/constants/ENV';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction à appeler pour continuer le processus.
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Ne pas vérifier le token si l'url est celui de generatetoken
  const lastPartOfUrl = req.url.split('/')[req.url.split('/').length - 1]; // remplace .at(-1)
  if (lastPartOfUrl === 'generatetoken') {
    next();
    return;
  }

  const authHeader = req.headers?.authorization; // optional chaining + dot notation
  const token = authHeader?.split(' ')[1];

  console.log(token);

  if (!token) return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);

  jwt.verify(token, ENV.JWTSECRET ?? '', (err, decoded) => {
    console.log(err);

    if (err) return res.sendStatus(HttpStatusCodes.FORBIDDEN);

    // Ici on pourrait récupérer les infos utilisateur depuis decoded si nécessaire
    // const user = decoded as JwtPayload;

    next();
  });
}

export default authenticateToken;
