## Procédure d'installation de l'API sur un poste local

- Copier le fichier .env.example et créer un fichier .env à la racine du projet.

- Modifier la variable MONGODB afin qu’elle contienne la chaîne de connexion MongoDB, qu’elle soit locale ou en ligne.

- Définir le host et le port.

PS : Dans le fichier .env.example, l’URL mongodb://localhost:27017/personnage_historique se termine par personnage_historique, ce qui permet de préciser la base de données à utiliser.

## Procédure de création de la base de données

- Créer une BD sur MongoDB utilisant le même nom de BD que l'URL de connection.

- Importer histoire.json se trouvant dans le dossier /dev/histoire.json qui comporte des données déjà existant.

## URL de l'api publiée

- https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net

- Pour la documentation de l'api : https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/docs
