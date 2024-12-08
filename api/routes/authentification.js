const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // Modèle Sequelize
const { createJWT } = require("../jwt");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ msg: "Pseudo et mot de passe requis" });
  }

  try {
    // Rechercher l'utilisateur dans la base de données
    const user = await User.findOne({ where: { pseudo } });
    if (!user) {
      return res.status(400).json({ msg: "Utilisateur introuvable" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Mot de passe incorrect" });
    }

    // Générer un JWT
    const token = createJWT(user.pseudo, user.role === "admin");

    // Retourner le JWT
    res.status(200).json({ access_token: token });
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    res.status(500).json({ msg: "Erreur interne au serveur" });
  }
});

module.exports = router;
