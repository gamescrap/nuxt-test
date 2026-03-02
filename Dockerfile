# Étape 1 : build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/.output /app/.output
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]