# Étape 1 : Utilisation de l'image de base Node.js
FROM node:23-bullseye-slim

# Étape 2 : Définir le répertoire de travail
WORKDIR /usr/src/app

# Étape 3 : Installer le client MySQL
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Étape 4 : Copier les fichiers de l'API dans le conteneur
COPY api/ .

# Étape 5 : Installer les dépendances Node.js
RUN npm install

# Étape 6 : Exposer le port 3000 pour l'application
EXPOSE 3000

# Étape 7 : Commande de démarrage (pour un développement avec nodemon)
CMD ["npx", "nodemon", "./bin/www"]
