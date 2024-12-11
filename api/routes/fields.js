const express = require("express");
const router = express.Router();
const { Field, Slot } = require("../../models");
const {
  mapFieldResourceObject,
  mapSlotResourceObject,
} = require('../hal');
const { checkAdmin } = require("../jwt");

// Lister tous les terrains
router.get("/fields", async (req, res) => {
  const baseURL = `${req.protocol}://${req.get("host")}`;
  try {
    const fields = await Field.findAll();
    const fieldResources = fields.map((field) =>
      mapFieldResourceObject(field, baseURL)
    );
    res.status(200).json({ _embedded: { fields: fieldResources } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Voir les créneaux disponibles pour un terrain
router.get("/fields/:id/slots", async (req, res) => {
  const baseURL = `${req.protocol}://${req.get("host")}`;
  try {
    const slots = await Slot.findAll({
      where: { fieldId: req.params.id, isAvailable: true },
    });
    const slotResources = slots.map((slot) =>
      mapSlotResourceObject(slot, baseURL)
    );
    res.status(200).json({ _embedded: { slots: slotResources } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Ajouter un terrain (Admin) ==> pas besoin cette route
/* router.post('/fields', async (req, res) => {
  try {
    const { name, available, reasonUnavailable } = req.body;
    const field = await Field.create({ name, available, reasonUnavailable });
    res.status(201).json({ message: 'Terrain ajouté', field });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de l’ajout du terrain' });
  }
}); */

// Voir les détails d'un terrain
router.get("/fields/:id", async (req, res) => {
  const baseURL = `${req.protocol}://${req.get("host")}`;
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) {
      return res.status(404).json({ error: "Terrain non trouvé" });
    }
    const fieldResource = mapFieldResourceObject(field, baseURL);
    res.status(200).json(fieldResource);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Modifier un terrain (Admin)
router.patch("/fields/:id", checkAdmin, async (req, res) => { 
  const baseURL = `${req.protocol}://${req.get("host")}`;
  try {
    const { available, reasonUnavailable } = req.body;
    const field = await Field.findByPk(req.params.id);
    if (!field) {
      return res.status(404).json({ error: "Terrain non trouvé" });
    }
    field.available = available;
    field.reasonUnavailable = reasonUnavailable;
    await field.save();
    const fieldResource = mapFieldResourceObject(field, baseURL);
    res.status(200).json(fieldResource);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour du terrain" });
  }
});

module.exports = router;
