# API Badminton

**Projet réalisé par Tom et Prince **

## Table des matières

1. [Introduction](#introduction "introduction")
2. [Prérequis](#Prérequis "Prérequis")
3. [Installation](#installation "installation")
4. [Utilisation](#utilisation)
5. [API (REST et GraphQL)](#api-rest-et-graphql)
6. [Cas d&#39;utilisation](#cas-dutilisation)
7. [Contributeurs](#contributeurs)

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

## Utilisation

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

## API (REST et GraphQL)

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

## Cas d'utilisation

## Contributeurs

* **Tom BIHOREAU**
* **Prince de Gloire ONDONGO**
