const express = require("express");
const moment = require("moment");
const router = express.Router();
const { Reservation, Slot, Field } = require("../../models");
const {
  mapReservationResourceObject,
  mapUserReservationsResourceObject,
} = require("../hal");


// Voir les réservations pour un utilisateur
router.get("/users/:userId/reservations", async (req, res) => {
  const baseURL = `${req.protocol}://${req.get("host")}`;
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
  const baseURL = `${req.protocol}://${req.get("host")}`;
  try {
    const { userId, slotId, date } = req.body;

    // 1. Vérification de l'utilisateur
    if (!userId) {
      return res
        .status(400)
        .json({ error: "L'identification de l'utilisateur est requise." });
    }

    // 2. Vérification que le créneau est dans la semaine en cours
    const reservationDate = moment(date);
    if (!reservationDate.isSame(moment(), "week")) {
      return res.status(400).json({
        error: "Les réservations doivent être faites dans la semaine en cours.",
      });
    }

    // 3. Vérification de la disponibilité du terrain
    const slot = await Slot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ error: "Créneau introuvable." });
    }
    const field = await Field.findByPk(slot.fieldId);
    if (!field || !field.available) {
      return res
        .status(400)
        .json({ error: "Le terrain est temporairement indisponible." });
    }

    // 4. Vérification que le créneau n'est pas déjà réservé
    const existingReservation = await Reservation.findOne({
      where: { slotId, date },
    });
    if (existingReservation) {
      return res.status(400).json({ error: "Ce créneau est déjà réservé." });
    }

    // Création de la réservation
    const reservation = await Reservation.create({ userId, slotId, date });

    // Mise à jour du créneau pour le marquer comme indisponible
    await slot.update({ available: false });

    const reservationResource = mapReservationResourceObject(
      reservation,
      baseURL
    );

    res.status(201).json({
      message:
        "Réservation effectuée avec succès. Ce créneau n'est plus disponible.",
      reservation: reservationResource,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création de la réservation." });
  }
});

// Annuler une réservation
router.delete("/reservations/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Vérifier si la date de la réservation n'est pas encore passée
    const today = moment().startOf("day");
    const reservationDate = moment(reservation.date);
    if (reservationDate.isSameOrAfter(today)) {
      // Rendre le créneau disponible
      const slot = await Slot.findByPk(reservation.slotId);
      if (slot) {
        await slot.update({ available: true });
      }
    }

    // Supprimer la réservation
    await reservation.destroy();
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Erreur serveur lors de la suppression de la réservation.",
      });
  }
});

module.exports = router;
