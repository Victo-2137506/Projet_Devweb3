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
    Base: '/generatetoken',
    Post: '/',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
