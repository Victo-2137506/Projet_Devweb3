// Le code est inspiré des notes de cours : https://web3.profinfo.ca/projet_complet_mongoose/

export default {
  Base: '/api',
  Histoire: {
    Base: '/histoire',
    GetAll: '/all', // Récupérer toutes les personnes historiques
    GetOne: '/:id', // Récupérer une personne historique par ID
    GetByFilter: '/filtre', // Récupérer des personnes selon des filtres
    Add: '/ajouter', // Ajouter une personne historique
    Update: '/modifier/:id', // Mettre à jour une personne historique par ID
    Delete: '/supprimer/:id', // Supprimer une personne historique par ID
  },
  GenerateToken: {
    Base: '/generatetoken', // Génere le token
    Post: '/',
  },
} as const;
