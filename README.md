# API Badminton

**Projet réalisé par Tom et Prince **

## Table des matières

1. [Introduction](#introduction "introduction")
2. [Prérequis](#Prérequis "Prérequis")
3. [Installation](#installation "installation")
4. [Ressources](#ressources "ressources")
5. [Utiliser le service :  cas nominal](#utilisation)
6. [Conception](#conception)
7. [Sécurité](#Sécurité)
8. [Remarques ](#Remarques)
9. [Références](#Références)
10. [Contributeurs](#contributeurs)

## Introduction

Ce projet est une API RESTful permettant de gérer un système de réservation de terrains de badminton pour une association. L'API inclut des fonctionnalités de réservation, d'annulation, et de gestion des indisponibilités des terrains. Une ressource GraphQL est également exposée pour faciliter l'intégration future d'une application mobile.

## Prérequis

Avant de commencer, assurez-vous que Docker et Docker Compose sont installés sur votre machine. Si vous ne les avez pas encore installés, vous pouvez suivre les instructions officielles :

- [Installer Docker](https://docs.docker.com/get-docker/)
- [Installer Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. **Clonez ce dépôt :**

   ```bash
   git clone https://github.com/tombihoreau/API-Badminton.git
   ```
2. **Accédez au répertoire :**

   ```bash
   cd API-Badminton
   ```
3. **Le fichier `.env` à la racine doit contenir les informations suivantes :**

   ###### - Variables d'environnement à la racine du projet

   Le fichier `.env` à la racine doit contenir les informations suivantes :


   ```bash
   # Mode d'environnement
   ENV=dev

   # Nom du projet
   PROJECT_NAME=api-badminton

   # Ports pour l'accès aux services depuis l'hôte
   HOST_PORT_API=3001
   HOST_PORT_DB=3306
   HOST_PORT_ADMINER=8080

   # Configuration de la base de données
   DB_NAME=mydb
   DB_USER=user
   DB_PASSWORD=password
   DB_HOST=db
   DB_PORT=3306
   DB_ROOT_PASSWORD=root
   ```
4. **Générer la clé privé**

   ```bash
   # Générer une clé privé 

   node generatekey
   ```
5. **Construisez et lancez les conteneurs Docker :**

```bash

docker-compose up --build

#Cette commande construira les services Docker (API, base de données MySQL, Adminer) et démarrera tous les conteneurs.


#=========== Utilitaires Docker ===============
# Si vous avez apporté des modifications ou souhaitez reconstruire les images des service utilisé : 
docker-compose build

#Pour démarrer les services (API, base de données MySQL, Adminer) sans reconstruire les images, utilisez
docker-compose up


#Pour arrêter les conteneurs et supprimer les ressources associées, utilisez :
docker-compose down

```

6. **Accès à l'application:**

Une fois que les conteneurs sont lancés avec Docker Compose, vous pouvez accéder aux différents services comme suit :

- **API** : L'API sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).
- **Adminer** : Adminer, une interface web pour gérer la base de données, sera disponible à l'adresse [http://localhost:8080](http://localhost:8080)

7. **Connexion à Adminer:**

   Pour vous connecter à la base de données MySQL via Adminer, entrez les informations suivantes dans le formulaire de conn

- **Serveur** : `db` (nom du service dans Docker Compose)
- **Nom d'utilisateur** : `user`
- **Mot de passe** : `password`
- **Base de données** : `mydb`

  Avec ces informations, vous pourrez gérer et interagir avec votre base de données MySQL directement depuis Adminer.

## Ressources

| Ressource               |              URL              | Méthodes HTTP | Paramètres d’URL/Variations                           | Qui peut faire ça               | Commentaires                                                                             |
| ----------------------- | :----------------------------: | -------------- | ------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| Authentification        |        `/auth/login`        | `POST`       | Aucune                                                  | Administrateur·ice              | Permet à un administrateur·ice de se connecter pour gérer les ressources protégées. |
| Liste des créneaux     |      `/slots/available`      | `GET`        | `date` (ex. `2024-11-27`), `terrain` (A, B, C, D) | Tout utilisateur                 | Récupère les créneaux disponibles pour une date et un terrain spécifiques.           |
| Réservation            |       `/reservations`       | `POST`       | Aucune                                                  | Tout utilisateur                 | Permet de créer une réservation en fournissant un pseudo et les détails du créneau.  |
| Annulation              |     `/reservations/{id}`     | `DELETE`     | `{id}` : Identifiant unique de la réservation        | Tout utilisateur                 | Permet d'annuler une réservation existante.                                             |
| Rendre terrain indispo  | `/terrains/{id}/unavailable` | `PATCH`      | `{id}` : Identifiant du terrain (A, B, C, D)          | Administrateur·ice              | Rend un terrain indisponible pour une période donnée. Protégé par authentification.  |
| Liste des réservations |       `/reservations`       | `GET`        | `date` (optionnel), `terrain` (optionnel)           | Administrateur·ice, utilisateur | Permet de lister les réservations existantes.                                           |

## Utiliser le service :  cas nominal {utilisation}

#### Étapes pour utiliser le service :

1. **Créer un utilisateur :**
   Envoyer une requête `POST` à l'URL `/users` avec un pseudo dans le corps de la requête pour s'inscrire.
   Exemple de payload JSON :
   ```json
   {
       "username": "paul_player1"
   }
   ```

 Réponse attendue :

```json
{
    "id": 1,
    "username": "player1"
}
```

**2. Se connecter en tant qu'administrateur**

Envoyer une requête `POST` à l'URL `/auth/login` avec les identifiants d'administrateur.

**Exemple de requête :**

```json
{
    "username": "admybad",
    "password": "astrongpassword."
}
```

Réponse attendue :

```json
{
    "access_token": "<JWT_TOKEN>"
}
```

3. **Lister les créneaux disponibles :**

   Envoyer une requête `GET` à l'URL `/slots/available?date=2024-11-27&terrain=A`.

Réponse attendue :

```json
[
    {
        "time": "10:00",
        "isAvailable": true
    },
    {
        "time": "10:45",
        "isAvailable": false
    }
]

```

**4 . Réserver un terrain :**

Envoyer une requête `POST` à l'URL `/reservations` avec les informations nécessaires.

Exemple :

```json
{
    "username": "player1",
    "date": "2024-11-27",
    "terrain": "A",
    "time": "10:00"
}
```

**5 . Annuler une réservation :**

Envoyer une requête `DELETE` à l'URL `/reservations/{reservation_id}`.
Remplacez `{reservation_id}` par l'ID de la réservation à annuler.

## Conception

### API RESTful

#### Ressources principales

#### Exemples d'EndPoints :

* **GET /terrains** : Récupérer la liste des terrains disponibles.
* **POST /reservations** : Créer une nouvelle réservation.
* **DELETE /reservations/:id** : Annuler une réservation.
* **PUT /terrains/:id/indisponible** : Rendre un terrain indisponible.

### API GraphQL

#### Requête GraphQL : `GetAvailableSlots`

Permet de récupérer les créneaux horaires disponibles pour un terrain spécifique à une date donnée.

1. **Effectuer une réservation** :
   Pour effectuer une réservation, envoyez une requête `POST` à `/reservations` avec les informations suivantes :
   ```json
   {
       "date": "2024-11-27",
       "time": "14:00",
       "terrain": "A",
       "pseudo": "JohnDoe"
   }
   ```

## Sécurité

##### 1. Authentification par JWT (JSON Web Token)

L'authentification pour les actions sensibles (comme rendre un terrain indisponible) est protégée par un système de JWT. Un administrateur doit se connecter avec un pseudo et un mot de passe spécifiques. Une fois authentifié, l'administrateur reçoit un jeton JWT qui permet d'accéder aux ressources protégées.
Ce jeton est inclus dans les en-têtes des requêtes pour garantir que seul l'administrateur peut effectuer certaines actions.

##### 2. Génération de clé secrète forte pour JWT

Une clé secrète forte est utilisée pour signer les JSON Web Tokens (JWT). Cette clé est conservée de manière sécurisée et n'est jamais exposée. Elle est utilisée pour garantir l'intégrité et la validité des jetons JWT émis lors de l'authentification de l'administrateur.

##### 3. Protection des endpoints sensibles

Les routes protégées par des actions administratives (comme rendre un terrain indisponible) sont uniquement accessibles par des utilisateurs authentifiés. Cela empêche les utilisateurs non autorisés de modifier l'état du système.

##### 4. Vérification des entrées utilisateur

Pour éviter les attaques par injection SQL ou autres types de manipulation de données, toutes les données envoyées par les utilisateurs sont soigneusement vérifiées et validées avant d'être traitées.Par exemple :

- Le pseudo de l'utilisateur est validé avant d'être utilisé dans une réservation.
- Les dates et heures sont également vérifiées pour s'assurer qu'elles respectent les formats attendus.

##### 5. Gestion des permissions

Les utilisateurs normaux ne peuvent pas accéder aux actions administratives.
Par exemple, la réservation d'un terrain est autorisée pour tous les utilisateurs, mais seule l'administrateur peut rendre un terrain indisponible. Cela garantit que les actions sensibles sont réservées à des personnes spécifiquement autorisées.

##### 6. Chiffrement des mots de passe

Les mots de passe sont stockés de manière sécurisée (hachés et salés) dans la base de données. Même si la base de données est compromise, les mots de passe restent protégés.

## Remarques

## Réferences

* **Documentation officielle de** [Node.js](https://nodejs.org/) - Documentation officielle pour Node.js.
* **OpenAPI Specification** - Spécification standard pour la description d'API RESTful.
* **Tutoriels de** [Sequelize](https://sequelize.org/) **pour l’ORM** - Tutoriels pour l'utilisation de Sequelize, un ORM pour Node.js.
* **JWT.io** : [https://jwt.io/](https://jwt.io/) - Documentation sur l'utilisation des JSON Web Tokens.
* **Express.js documentation** : [https://expressjs.com/](https://expressjs.com/) - Documentation pour le framework Node.js, utile pour implémenter des API REST sécurisées.
* **MDN Web Docs** : [https://developer.mozilla.org/](https://developer.mozilla.org/) - Pour des exemples sur l’utilisation des requêtes HTTP et la gestion des API.
* **RESTful API Design** : [https://www.restapitutorial.com/](https://www.restapitutorial.com/) - Un tutoriel détaillé sur la conception d'API REST.
* **Docker Documentation** : [https://docs.docker.com/](https://docs.docker.com/) - Documentation officielle sur Docker, un outil permettant de conteneuriser les applications pour une gestion plus simple des environnements.
* **Protection contre les attaques par force brute** : Implémentation de stratégies pour sécuriser les logins et prévenir les attaques par force brute. [OWASP Brute Force Protection]()
* **Rate Limiting** : Mise en œuvre de la limitation du taux de requêtes pour éviter les abus et protéger les ressources des serveurs. [Express-rate-limit](https://www.npmjs.com/package/express-rate-limit) pour Node.js.
* **White-list / Black-list** : Implémentation de listes blanches et noires pour contrôler l'accès aux ressources, en autorisant uniquement certaines adresses IP ou utilisateurs.
* **Gestion des Secrets / Variables d’Environnement** : Pour une gestion sécurisée des variables d'environnement et des secrets dans des applications Node.js. Utilisation d'outils comme [dotenv](https://www.npmjs.com/package/dotenv).
* **Node.js Process Management** : Gestion des processus Node.js via des outils comme [PM2](), un gestionnaire de processus permettant de maintenir les applications Node en fonctionnement continu, même après un crash.

## Contributeurs

* **Tom BIHOREAU**
* **Prince de Gloire ONDONGO**
