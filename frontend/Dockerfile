# Étape 1: Utiliser une image Node.js légère
FROM node:20-alpine

# Étape 2: Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances et les installer
# On copie ces fichiers en premier pour profiter du cache de Docker
COPY package*.json ./
RUN npm install

# Étape 4: Copier le reste du code de l'application
COPY . .

# Étape 5: Exposer le port par défaut de Vite
EXPOSE 5173

# Étape 6: Définir la commande pour démarrer le serveur de développement
# L'option --host est cruciale pour que le serveur soit accessible depuis l'extérieur du conteneur
CMD ["npm", "run", "dev"]