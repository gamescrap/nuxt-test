# nuxt-test

Application Nuxt.js containerisée avec Docker, déployée sur Clever Cloud.

## Prérequis

- [Node.js](https://nodejs.org/) v20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Développement local

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement (avec DevTools Nuxt et extension Vue actives) :

```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

## Build et exécution via Docker

### Avec Docker Compose

Construire et lancer le container :

```bash
docker compose up --build
```

`--build` reconstruit l'image automatiquement si des fichiers ont changé.

Pour arrêter :

```bash
docker compose down
```

L'application est accessible sur `http://localhost:3000`.

### Sans Docker Compose

Construire l'image Docker :

```bash
docker build -t nuxt-test .
```

Lancer le container :

```bash
docker run -p 3000:8080 --rm --name nuxt-test-container nuxt-test
```

L'application est accessible sur `http://localhost:3000`.

> **Note :** Le container expose le port `8080` en interne (requis par Clever Cloud).
> Les DevTools Nuxt et l'extension Vue ne sont pas disponibles en mode production.

## Différence entre les modes

| Mode | Commande | DevTools | Usage |
|---|---|---|---|
| Développement | `npm run dev` | ✅ | Développement quotidien |
| Production | `docker compose up --build` | ❌ | Test production local / déploiement |

## Déploiement

Ce projet est hébergé sur **Clever Cloud** via un pipeline CI/CD connecté à **GitHub**.  
Tout push sur la branche `main` déclenche automatiquement un déploiement.