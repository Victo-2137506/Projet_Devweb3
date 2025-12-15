import { IUserLogin } from '@src/models/User';
import UserService from './UserService';
import jwt from 'jsonwebtoken';
import ENV from '@src/common/constants/ENV';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';

// Le code est inspiré des notes de cours : // Le code est inspiré des notes de cours : https://web3.profinfo.ca/express_jwt/

/**
 * Générer un jeton pour un utilisateur
 *
 * @param {IUserLogin} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise<string>} - Le jeton signé
 */
async function generateToken(utilisateur: IUserLogin): Promise<string> {
  const utilisateurBD = (await UserService.getAll()).find(
    (user) => user.email === utilisateur.email,
  );

  if (utilisateurBD && utilisateurBD.password === utilisateur.password) {
    return jwt.sign(utilisateur.email, ENV.Jwtsecret ?? '');
  } else {
    return '';
  }
}

export default {
  generateToken,
} as const;
