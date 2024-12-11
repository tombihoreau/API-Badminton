const rateLimit = require("express-rate-limit");

// limite pour les tentatives de connexion
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
});

module.exports = loginRateLimiter;