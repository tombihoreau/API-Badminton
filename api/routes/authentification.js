const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../../models"); // Modèle Sequelize
const { createJWT } = require("../jwt");
const loginRateLimiter = require("../rateLimiter");
const router = express.Router();

router.post("/login", loginRateLimiter, async (req, res) => {
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

    console.log("connexion iciiiiiii============+>", user);
    // Générer un JWT
    const token = createJWT(user.pseudo, user.role, user.id);

    // Retourner le JWT
    res.status(200).json({ access_token: token });
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    res.status(500).json({ msg: "Erreur interne au serveur" });
  }
});

// Route pour l'inscription (création de compte)
router.post("/register", async (req, res) => {
  const { pseudo, password} = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ msg: "Pseudo, mot de passe et email requis" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { pseudo } });
    if (existingUser) {
      return res.status(400).json({ msg: "Pseudo déjà pris" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({ pseudo, password: hashedPassword });

    // Générer un JWT
    const token = createJWT(newUser.pseudo, newUser.role);
    res.status(201).json({ access_token: token });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ msg: "Erreur interne au serveur" });
  }
});



module.exports = router;
