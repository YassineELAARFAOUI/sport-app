# Étape 1: Construction de l'application
FROM node:22.13.1-alpine AS builder

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./  

# Installer les dépendances  
RUN npm install  

# Copier les fichiers de Prisma  
COPY prisma ./prisma  

# Générer le client Prisma
RUN npx prisma generate --schema=prisma/schema.prisma  

# Copier le reste du projet  
COPY . . 

# Construire l'application Next.js  
RUN npm run build  

# Étape 2: Exécution de l'application
FROM node:22.13.1-alpine  

WORKDIR /app  

# Copier les fichiers générés depuis le builder  
COPY --from=builder /app ./  

# Exposer le port sur lequel Next.js tourne  
EXPOSE 3000  

# Démarrer l'application (la commande sera remplacée par celle dans docker-compose.yml)
CMD ["npm", "run", "start"]
