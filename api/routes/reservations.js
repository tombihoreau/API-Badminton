const express = require('express');
const router = express.Router();
const { Reservation } = require('../../models');

// Voir les réservations pour un utilisateur
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const reservations = await Reservation.findAll({ where: { userId } });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une réservation
router.post('/', async (req, res) => {
  try {
    const { userId, slotId, date } = req.body;
    const reservation = await Reservation.create({ userId, slotId, date });
    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// Annuler une réservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    await reservation.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
