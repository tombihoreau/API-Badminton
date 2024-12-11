const { Sequelize } = require("sequelize");

console.log("DB_NAME:", process.env.DB_NAME);  // Vérification de la variable d'environnement DB_NAME
console.log("DB_USER:", process.env.DB_USER);  // Vérification de la variable d'environnement DB_USER
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);  // Vérification de la variable d'environnement DB_PASSWORD
console.log("DB_HOST:", process.env.DB_HOST);  // Vérification de la variable d'environnement DB_HOST
console.log("DB_PORT:", process.env.DB_PORT);  // Vérification de la variable d'environnement DB_PORT

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false, // Désactive les logs de requêtes SQL pour un environnement de production
});

module.exports = sequelize;
