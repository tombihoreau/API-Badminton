# API Badminton

**Projet réalisé par Prince et Tom**

## Table des matières

1. [Introduction](#introduction "introduction")
2. [Installation](#installation "installation")
3. [Utilisation](#utilisation)
4. [API (REST et GraphQL)](#api-rest-et-graphql)
5. [Cas d&#39;utilisation](#cas-dutilisation)
6. [Contributeurs](#contributeurs)

## Introduction

Ce projet est une API RESTful permettant de gérer un système de réservation de terrains de badminton pour une association. L'API inclut des fonctionnalités de réservation, d'annulation, et de gestion des indisponibilités des terrains. Une ressource GraphQL est également exposée pour faciliter l'intégration future d'une application mobile.

## Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/tombihoreau/API-Badminton.git
   ```
2. Accédez au répertoire :

   ```bash
   cd API-Badminton
   ```
3. Installez les dépendances :

   ```bash
   npm install
   ```
4. Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement nécessaires :

   ```env
   DATABASE_URL=your_database_url
   PORT=3000
   ```
5. Lancez le serveur de développement :

   ```bash
   npm run dev
   ```
6. L'API sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

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

* **Tom** BIHOREAU
* **Prince de Gloire ONDONGO**
