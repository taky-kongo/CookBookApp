# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances et les installer
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine

# Copier les fichiers construits depuis le stage 'build' vers le dossier web de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# La commande par défaut de l'image Nginx se chargera de démarrer le serveur.