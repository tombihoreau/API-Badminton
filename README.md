# API Badminton

**Projet réalisé par Tom et Prince**

## Table des matières

1. [Introduction](#introduction "introduction")
2. [Prérequis](#prérequis "Prérequis")
3. [Installation](#installation "installation")
4. [Ressources](#ressources "ressources")
5. [Utiliser le service :  cas nominal](#utiliser-le-service---cas-nominal-utilisation)
6. [Conception](#conception)
7. [Sécurité](#sécurité)
8. [Remarques ](#remarques)
9. [Références](#réferences)
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

6. **Migration et Seed de la Base de Données**

   Les migrations ne sont pas automatiquement exécutées avec `docker-compose up`, donc vous devez les exécuter manuellement. Suivez les étapes ci-dessous pour migrer et remplir la base de données avec les données nécessaires.

   ##### Connectez-vous à votre conteneur de l'API avec Docker

   Ouvrez un nouveau terminal et connectez-vous à votre conteneur de l'API avec la commande suivante :


   ```bash

   docker exec -it api-badminton-api sh

   ```

   Cela vous permettra d'exécuter des commandes à l'intérieur du conteneur.

   ##### **Exécutez les migrations**

   Une fois dans le conteneur, exécutez les migrations avec la commande suivante :

   ```bash

   npx sequelize-cli db:migrate
   #Cela appliquera les migrations de la base de données et mettra à jour la structure des tables.
   ```

   ##### **Seed de la base de données**

   Ajouter des données de seed
   Après avoir exécuté les migrations, vous pouvez remplir votre base de données avec des données de test en exécutant la commande suivante :

   ```bash

   npx sequelize-cli db:seed:all
   #Cela ajoutera les données de test définies dans vos fichiers de seed à la base de données.

   #Utilitaire pour supprimer les données présentes
   npx sequelize-cli db:seed:undo:all

   ```
7. **Accès à l'application:**

Une fois que les conteneurs sont lancés avec Docker Compose, vous pouvez accéder aux différents services comme suit :

- **API** : L'API sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).
- **Adminer** : Adminer, une interface web pour gérer la base de données, sera disponible à l'adresse [http://localhost:8080](http://localhost:8080)

8. **Connexion à Adminer**

Pour vous connecter à la base de données MySQL via Adminer, entrez les informations suivantes dans le formulaire de conn

- **Serveur** : `db` (nom du service dans Docker Compose)
- **Nom d'utilisateur** : `user`
- **Mot de passe** : `password`
- **Base de données** : `mydb`

  Avec ces informations, vous pourrez gérer et interagir avec votre base de données MySQL directement depuis Adminer.

## Ressources

| Ressource                                |               URL               | Méthodes HTTP | Paramètres d’URL/Variations                    | Qui peut faire ça                                       | Commentaires                                                                                                 |
| ---------------------------------------- | :-----------------------------: | -------------- | ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Authentification                         |           `/login`           | `POST`       | Aucun                                            | Administrateur·ice                                      | Permet à un administrateur·ice de se connecter pour gérer les ressources protégées.                     |
| Création de compte                      |          `/register`          | `POST`       | Aucun                                            | Tout utilisateur                                         |                                                                                                              |
| Liste des créneaux d'un terrain         |      `/fields/:id/slots`      | `GET`        | <br /> {id} : Identifiant du                    | Tout utilisateur                                         | Récupère les créneaux disponibles pour une date et un terrain spécifiques.                               |
| Réservation                             |        `/reservations`        | `POST`       | Aucun                                            | Tout utilisateur connecté ( pour savoir qui a reservé) | Permet de créer une réservation en fournissant un pseudo (en etant connecté) et les détails du créneau. |
| Annulation                               |     `/reservations/{id}`     | `DELETE`     | `{id}` : Identifiant unique de la réservation | Tout utilisateur                                         | Permet d'annuler une réservation existante.                                                                 |
| Rendre terrain indispo ou dispo          |           /fields/:id           | `PATCH`      | `{id}` : Identifiant du terrain               | Administrateur·ice                                      | Rend un terrain indisponible pour une période donnée. Protégé par authentification.                      |
| Liste des réservations                  |        `/reservations`        | `GET`        | <br /> Aucun                                     | Administrateur·ice                                      | Permet de lister les réservations existantes.                                                               |
| Liste des réservations d'un utilisateur | `/users/:userId/reservations` | `GET`        | Aucun                                            | Tout utilisateur                                         | Permet de lister les réservations existantes d'un utilisateur.                                              |

## Utiliser le service :  cas nominal

##### **Cas Nominal pour l'Administrateur**

###### 1. **Authentification en tant qu'Administrateur**

* **But** : Se connecter à l'interface administrateur avec les identifiants réservés.
* **Préconditions** : L'admin doit connaître son pseudo et mot de passe.
* **Étapes** :
  1. L'administrateur envoie une requête `POST` à l'URL `/auth/login` avec les identifiants.
  2. L'API renvoie un `JWT_TOKEN` pour authentifier l'administrateur.

**Exemple de requête :**

```json
{
    "username": "admybad",
    "password": "astrongpassword."
}
```

**Réponse attendue :**

```json
{
    "access_token": "<JWT_TOKEN>"
}
```

**2. Rendre un terrain indisponible**

* **But** : Rendre un terrain temporairement indisponible pour les réservations (par exemple, terrain B).
* **Préconditions** : L'administrateur doit être connecté avec le token d'authentification.
* **Étapes** :

  1. L'administrateur envoie une requête `POST` à l'URL `/terrain/{terrain}/indisponible` pour mettre un terrain en mode indisponible.
  2. Le terrain sélectionné devient indisponible pour toute nouvelle réservation.

**Exemple de requête :**

```json
{
    "terrain_id": "exemple id "
}
```

**Réponse attendue :**

```json
{
    "message": "Le terrain  est maintenant indisponible."
}
```

##### Cas Nominal pour un utilisateur normal

**1. Lister les créneaux disponibles d'un terrain :**

Envoyer une requête `GET` à l'URL  /fields/:id/slots.

```bash

#======= présicer l'id du terrain

```

**Réponse attendue :**

```json
// ========= Ceci est un exemple 
{
  "_embedded": {
    "slots": [
      {
        "_links": {
          "self": {
            "href": "http://localhost:3000/fields/14/slots/3",
            "templated": false
          }
        },
    ]
  }
}

```

**2. Réserver un terrain :**

Envoyer une requête `POST` à l'URL `/reservations` avec les informations nécessaires .
NB: Il faut être connecté pour cela

**Exemple :**

```json
{
  "slotId": 0,
  "date": "2024-12-11"
}
```

**Réponse attendue :**

```json
//========== Ceci est exemple 
{
    "message": "Réservation réussie pour le terrain A le 27 novembre 2024 à 10h00."
}
```

**5 . Annuler une réservation :**

* **But** : Annuler une réservation existante.
* **Préconditions** : L'utilisateur doit disposer d'une réservation à annuler et être connecté.
* **Étapes** :

  1. L'utilisateur envoie une requête `DELETE` à l'URL `/reservations/:id ` avec l'ID de la réservation à annuler.
  2. L'API confirme l'annulation.

**Exemple :**

```json
{
    "reservation_id": 1
}
```

Réponse attendue

```json
{
    "message": "La réservation a été annulée avec succès."
}
```

## Conception

#### Dictionnaire des données

| **Nom de la donnée** | **Type**    | **Description**                                                                | **Contraintes**                                                          |
| --------------------------- | ----------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **pseudo**            | `string`        | Le pseudo de l'utilisateur ou de l'administrateur.                                   | Obligatoire pour s'identifier. Doit être unique                              |
| **password**          | `string`        | Le mot de passe de l'utilisateur ou administrateur (lors de la connexion).           | Obligatoire lors de la connexion, doit être sécurisé.                       |
| **role**              | `enum`          | Role de l'utilisateur                                                                | Doit être user ou admin                                                       |
| **date**              | `string` (date) | La date de la réservation ou de la disponibilité.                                  | Doit être au format `YYYY-MM-DD`.                                           |
| **name(terrain)**     | `string`        | Le nom du terrain réservé ou à rendre indisponible.                               | Doit être une des valeurs suivantes :`A`, `B`, `C`, `D`.              |
| **time**              | `string` (time) | L'heure du créneau réservé.                                                       | Doit être au format `HH:mm`.                                                |
| **reservationId**     | `integer`       | L'identifiant de la réservation.                                                    | Doit être unique pour chaque réservation.                                    |
| **slotId**            | `integer`       | L'identifiant du creneau                                                             | Doit être unique                                                              |
| **fieldId**           | `integer`       | L'identifiant du terrain                                                             | Doit être unique                                                              |
| **userId**            | `integer`       | L'identifiant de l'utilisateur                                                       | Doit être unique                                                              |
| **access_token**      | `string`        | Le jeton JWT utilisé pour authentifier un administrateur.                           | Obligatoire pour les actions administratives, valide pendant un certain temps. |
| **isAvailable**       | `boolean`       | Indique si un créneau est disponible ou non.                                        | `true` si disponible, `false` si non.                                      |
| **available**         | `string`        | L'état d'un terrain : disponible, indisponible.                                     | Peut être `available` ou `unavailable`.                                   |
| **reasonUnavailable** | `string`        | Raison de l'indisponibilité                                                         | Est un string                                                                  |
| **createdAt**         | `datetime`      | Date et heure de la création de la réservation ou de la modification d'un terrain. | Automatiquement généré par le système lors de la création.                |
| **updatedAt**         | `datetime`      | Date et heure de la dernière modification.                                          | Automatiquement généré par le système lors de la modification.             |

---

#### Explication des colonnes :

- **Nom de la donnée** : Le nom de la donnée ou du champ dans la base de données ou dans l'API.
- **Type** : Le type de la donnée, comme `string`, `boolean`, `integer`, `datetime`, etc.
- **Description** : Une brève description du rôle ou de l'objectif de la donnée dans l'API ou le système.
- **Contraintes** : Les restrictions, règles ou formats que la donnée doit respecter pour être valide. Cela inclut des informations sur la longueur des chaînes de caractères, le format des dates, ou des valeurs acceptées.

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

##### 7. **Mise en place du rate-limiting pour sécuriser les tentatives d'authentification**

Afin de protéger l'application contre les attaques par  **brute-force** , nous avons mis en place un mécanisme de **rate-limiting** pour limiter le nombre de tentatives de connexion sur une période donnée. Cela empêche les attaquants de tenter de deviner les informations d'identification de l'administrateur en effectuant trop de tentatives consécutives. Par exemple, un utilisateur est limité à 5 tentatives de connexion par adresse IP toutes les 15 minutes. Un message d'erreur spécifique est renvoyé lorsque la limite est dépassée, assurant une meilleure protection contre les attaques par  **brute-force** .

##### 8. **Implémentation de garde-fous dans les routes sensibles**

Des garde-fous ont été ajoutés dans les routes sensibles pour assurer que les utilisateurs ne peuvent pas réserver un créneau qui est déjà **indisponible** ou effectuer des actions sur des terrains  **invalides** . Ce mécanisme de validation vérifie que les données envoyées par les utilisateurs respectent les critères définis (par exemple, vérification de la disponibilité des créneaux, validation des ID de terrain, etc.). Cela permet de garantir l'intégrité des données et de prévenir toute tentative de manipulation des utilisateurs non autorisés ou de mauvaises pratiques.

## Remarques

* La principale difficulté rencontrée lors de la conception du système a été de gérer la logique d'indisponibilité temporaire des terrains. Il est essentiel de s'assurer que la gestion de l'indisponibilité ne bloque pas les utilisateurs qui pourraient vouloir réserver d'autres terrains.
* L'utilisation de JWT pour sécuriser les ressources et contrôler l'accès a été une solution adéquate pour gérer l'authentification et les permissions d'accès aux différentes ressources.

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
