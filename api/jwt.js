const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Paramètres JWT
const expires = "1 day";

// Lire la clé privée pour le JWT
let secret;
try {
  secret = fs.readFileSync(path.resolve(__dirname, "private.key"), "utf8");
} catch (error) {
  console.error("Erreur : clé privée introuvable !");
  process.exit(1);
}

// Fonction pour créer un JWT
function createJWT(login, role , userId) {
  return jwt.sign({ login, role, userId}, secret, { expiresIn: expires });
}

// Fonction pour extraire le token du header
function extractBearerToken(header) {
  if (typeof header !== "string") return false;
  const matches = header.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
}

// Middleware : authentification via JWT
function checkTokenMiddleware(req, res, next) {
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      msg: "Vous n'êtes pas autorisé à accéder à cette ressource",
    });
  }

  // Vérifier le token
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({
        msg: "Token invalide ou expiré",
      });
    }

    // Le token est valide
    res.locals.decodedToken = decodedToken;
    next();
  });
}

function checkAdmin(req, res, next) {
  checkTokenMiddleware(req, res, () => {
    const { role } = res.locals.decodedToken;
    if (role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({
          msg: "Accès interdit, seul un administrateur peut effectuer cette action.",
        });
    }
  });
}

module.exports = { createJWT, checkTokenMiddleware, checkAdmin };
