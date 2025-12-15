import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import HistoireRepo from '@src/repos/HistoireRepo';
import { Histoire, IHistoire } from '@src/models/Histoire';
import {
  PERSONNE_NOT_FOUND_ERR,
  CHAMP_MANQUANT_ERR,
  DONNEES_INVALIDES_ERR,
} from '@src/services/HistoireService';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ValidationError } from '@src/common/util/route-errors';

import Paths from './common/Paths';
import { parseValidationErr, TRes } from './common/util';
import { agent } from './support/setup';

/* eslint-disable */

// Le code est inspiré des notes de cours : https://web3.profinfo.ca/tester_api/

/******************************************************************************
                               Constants
******************************************************************************/

// Données bidon pour les personnages historiques (simulacre de GET)
const DB_HISTOIRES = [
  {
    nom: 'Napoléon Bonaparte',
    pays: 'France',
    naissance: new Date('1769-08-15'),
    mort: new Date('1821-05-05'),
    vivant: false,
    siecle: 18,
    role: 'Empereur',
    faitsMarquants: [
      "Campagne d'Égypte",
      'Code civil',
      "Bataille d'Austerlitz",
    ],
  },
  {
    nom: 'Marie Curie',
    pays: 'France',
    naissance: new Date('1867-11-07'),
    mort: new Date('1934-07-04'),
    vivant: false,
    siecle: 19,
    role: 'Scientifique',
    faitsMarquants: [
      'Prix Nobel de Physique',
      'Prix Nobel de Chimie',
      'Découverte du radium',
    ],
  },
  {
    nom: 'Winston Churchill',
    pays: 'Royaume-Uni',
    naissance: new Date('1874-11-30'),
    mort: new Date('1965-01-24'),
    vivant: false,
    siecle: 19,
    role: 'Premier ministre',
    faitsMarquants: [
      'Seconde Guerre mondiale',
      'Prix Nobel de littérature',
      'Discours historiques',
    ],
  },
] as const;

// Ne pas comparer 'id' car il est généré dynamiquement par la base de données
const compareHistoireArrays = customDeepCompare({
  onlyCompareProps: ['nom', 'pays', 'vivant', 'siecle', 'role'],
});

/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('histoireRouter', () => {
  let dbHistoires: IHistoire[] = [];

  // Extraire toutes les personnes historiques
  describe(`'GET:${Paths.Histoire.Base}${Paths.Histoire.GetAll}'`, () => {
    // Succès
    it(
      'doit retourner un JSON avec toutes les personnes historiques et un code de ' +
        `'${HttpStatusCodes.OK}' si réussi.`,
      async () => {
        const res: TRes<{ histoires: IHistoire[] }> = await agent.get(
          Paths.Base + Paths.Histoire.Base + Paths.Histoire.GetAll,
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(
          compareHistoireArrays(res.body.histoires, DB_HISTOIRES),
        ).toBeTruthy();
      },
    );
  });

  // Extraire une personne historique par ID
  describe(`'GET:${Paths.Histoire.Base}${Paths.Histoire.GetOne}'`, () => {
    // Succès
    it(`doit retourner un JSON avec une personne historique et un code de '${HttpStatusCodes.OK}' si réussi.`, async () => {
      const id = dbHistoires[0]._id;
      const res: TRes<{ histoire: IHistoire }> = await agent.get(
        Paths.Base + Paths.Histoire.Base + `/${id}`,
      );
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.histoire.nom).toBe(DB_HISTOIRES[0].nom);
    });

    // Personne non trouvée
    it(
      'doit retourner un JSON avec erreur ' +
        `'${PERSONNE_NOT_FOUND_ERR}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'id n'est pas trouvé.`,
      async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res: TRes = await agent.get(
          Paths.Base + Paths.Histoire.Base + `/${fakeId}`,
        );
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PERSONNE_NOT_FOUND_ERR);
      },
    );
  });

  // Rechercher par filtres
  describe(`'GET:${Paths.Histoire.Base}${Paths.Histoire.GetByFilter}'`, () => {
    // Filtrer par pays
    it(`doit retourner les personnes filtrées par pays et un code de '${HttpStatusCodes.OK}' si réussi.`, async () => {
      const res: TRes<{ histoires: IHistoire[] }> = await agent.get(
        Paths.Base +
          Paths.Histoire.Base +
          Paths.Histoire.GetByFilter +
          '?pays=France',
      );
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.histoires.length).toBeGreaterThan(0);
      expect(
        res.body.histoires.every((h: IHistoire) => h.pays === 'France'),
      ).toBeTruthy();
    });

    // Filtrer par siècle
    it(`doit retourner les personnes filtrées par siècle et un code de '${HttpStatusCodes.OK}' si réussi.`, async () => {
      const res: TRes<{ histoires: IHistoire[] }> = await agent.get(
        Paths.Base +
          Paths.Histoire.Base +
          Paths.Histoire.GetByFilter +
          '?siecle=19',
      );
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.histoires.length).toBeGreaterThan(0);
      expect(
        res.body.histoires.every((h: IHistoire) => h.siecle === 19),
      ).toBeTruthy();
    });
  });

  // Tester l'ajout d'une personne historique
  describe(`'POST:${Paths.Histoire.Base}${Paths.Histoire.Add}'`, () => {
    // Ajout réussi
    it(
      `doit retourner le code '${HttpStatusCodes.CREATED}' si la ` +
        'transaction est réussie',
      async () => {
        const histoire: IHistoire = {
          nom: 'Albert Einstein',
          pays: 'Allemagne',
          naissance: new Date('1879-03-14'),
          mort: new Date('1955-04-18'),
          vivant: false,
          siecle: 19,
          role: 'Physicien',
          faitsMarquants: [
            'Théorie de la relativité',
            'Prix Nobel de Physique 1921',
          ],
        };
        const res = await agent
          .post(Paths.Base + Paths.Histoire.Base + Paths.Histoire.Add)
          .send({ histoire });
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body.id).toBeDefined();
      },
    );

    // Paramètre manquant
    it(
      'doit retourner un JSON avec les erreurs et un code de ' +
        `'${HttpStatusCodes.BAD_REQUEST}' si un paramètre est ` +
        'manquant.',
      async () => {
        const res: TRes = await agent
          .post(Paths.Base + Paths.Histoire.Base + Paths.Histoire.Add)
          .send({ histoire: null });
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        const errorObj = parseValidationErr(res.body.error);
        expect(errorObj.message).toBe(ValidationError.MESSAGE);
        expect(errorObj.errors[0].prop).toBe('histoire');
      },
    );

    // Champs obligatoires manquants
    it(
      'doit retourner un JSON avec erreur ' +
        `'${CHAMP_MANQUANT_ERR}' et un code de ` +
        `'${HttpStatusCodes.BAD_REQUEST}' si des champs obligatoires sont manquants.`,
      async () => {
        const histoire = {
          nom: 'Test',
          // pays manquant
          naissance: new Date('2000-01-01'),
          // vivant manquant
          siecle: 20,
          role: 'Test',
          faitsMarquants: [],
        };
        const res: TRes = await agent
          .post(Paths.Base + Paths.Histoire.Base + Paths.Histoire.Add)
          .send({ histoire });
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toContain(CHAMP_MANQUANT_ERR);
      },
    );

    // Dates incohérentes
    it('doit retourner une erreur si la date de décès est antérieure à la date de naissance.', async () => {
      const histoire: IHistoire = {
        nom: 'Test Invalide',
        pays: 'France',
        naissance: new Date('2000-01-01'),
        mort: new Date('1990-01-01'), // Date de décès avant naissance
        vivant: false,
        siecle: 20,
        role: 'Test',
        faitsMarquants: [],
      };
      const res: TRes = await agent
        .post(Paths.Base + Paths.Histoire.Base + Paths.Histoire.Add)
        .send({ histoire });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(res.body.error).toContain('date de décès');
    });

    // Siècle invalide
    it('doit retourner une erreur si le siècle est invalide.', async () => {
      const histoire: IHistoire = {
        nom: 'Test Invalide',
        pays: 'France',
        naissance: new Date('2000-01-01'),
        mort: null,
        vivant: true,
        siecle: 25, // Siècle invalide
        role: 'Test',
        faitsMarquants: [],
      };
      const res: TRes = await agent
        .post(Paths.Base + Paths.Histoire.Base + Paths.Histoire.Add)
        .send({ histoire });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(res.body.error).toContain('siècle');
    });
  });

  // Mise à jour d'une personne historique
  describe(`'PUT:${Paths.Histoire.Base}${Paths.Histoire.Update}'`, () => {
    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la mise à jour ` +
        'est réussie.',
      async () => {
        const id = dbHistoires[0]._id;
        const histoire = { ...dbHistoires[0] };
        histoire.nom = 'Napoléon Ier';
        const res = await agent
          .put(Paths.Base + Paths.Histoire.Base + `/modifier/${id}`)
          .send({ histoire });
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Personne non trouvée
    it(
      'doit retourner un JSON avec erreur ' +
        `'${PERSONNE_NOT_FOUND_ERR}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si l'id n'est pas trouvé.`,
      async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const histoire: IHistoire = {
          nom: 'Test',
          pays: 'Test',
          naissance: new Date('2000-01-01'),
          vivant: true,
          siecle: 20,
          role: 'Test',
          faitsMarquants: [],
        };
        const res: TRes = await agent
          .put(Paths.Base + Paths.Histoire.Base + `/modifier/${fakeId}`)
          .send({ histoire });
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PERSONNE_NOT_FOUND_ERR);
      },
    );
  });

  // Supprimer une personne historique
  describe(`'DELETE:${Paths.Histoire.Base}${Paths.Histoire.Delete}'`, () => {
    // Succès
    it(
      `doit retourner un code de '${HttpStatusCodes.OK}' si la ` +
        'suppression est réussie.',
      async () => {
        const id = dbHistoires[0]._id;
        const res = await agent.delete(
          Paths.Base + Paths.Histoire.Base + `/supprimer/${id}`,
        );
        expect(res.status).toBe(HttpStatusCodes.OK);
      },
    );

    // Personne non trouvée
    it(
      'doit retourner un JSON avec erreur ' +
        `'${PERSONNE_NOT_FOUND_ERR}' et un code de ` +
        `'${HttpStatusCodes.NOT_FOUND}' si la personne est introuvable.`,
      async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const res: TRes = await agent.delete(
          Paths.Base + Paths.Histoire.Base + `/supprimer/${fakeId}`,
        );
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(PERSONNE_NOT_FOUND_ERR);
      },
    );
  });
});
