const express = require("express");
const router = express.Router();
const { Reservation } = require("../../models");
const {
  mapReservationResourceObject,
  mapUserReservationsResourceObject,
} = require("../hal");
const baseURL = `${req.protocol}://${req.get("host")}`;

// Voir les réservations pour un utilisateur
router.get("/users/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.query;
    const reservations = await Reservation.findAll({ where: { userId } });
    const userReservations = mapUserReservationsResourceObject(
      reservations,
      userId,
      baseURL
    );
    res.status(200).json(userReservations);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Créer une réservation
router.post("/reservations", async (req, res) => {
  try {
    const { userId, slotId, date } = req.body;
    const reservation = await Reservation.create({ userId, slotId, date });
    const reservationResource = mapReservationResourceObject(
      reservation,
      baseURL
    );
    res.status(201).json(reservationResource);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Erreur lors de la création de la réservation" });
  }
});

// Annuler une réservation
router.delete("/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
    await reservation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
