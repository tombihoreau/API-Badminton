const express = require('express');
const router = express.Router();
const { Field, Slot } = require('../../models');

// Lister tous les terrains
router.get('/', async (req, res) => {
  try {
    const fields = await Field.findAll();
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Voir les créneaux disponibles pour un terrain
router.get('/:id/slots', async (req, res) => {
  try {
    const slots = await Slot.findAll({ where: { fieldId: req.params.id, isAvailable: true } });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un terrain (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, available, reasonUnavailable } = req.body;
    const field = await Field.create({ name, available, reasonUnavailable });
    res.status(201).json({ message: 'Terrain ajouté', field });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de l’ajout du terrain' });
  }
});

// Modifier un terrain (Admin)
router.patch('/:id', async (req, res) => {
  try {
    const { available, reasonUnavailable } = req.body;
    const field = await Field.findByPk(req.params.id);
    if (!field) {
      return res.status(404).json({ error: 'Terrain non trouvé' });
    }
    field.available = available;
    field.reasonUnavailable = reasonUnavailable;
    await field.save();
    res.json({ message: 'Terrain mis à jour', field });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour du terrain' });
  }
});

module.exports = router;
