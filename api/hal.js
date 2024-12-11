/**
 * Export des fonctions helpers pour la spécification HAL
 * Voir la spécification HAL : https://stateless.group/hal_specification.html
 * Voir la spécification HAL (RFC, source) : https://datatracker.ietf.org/doc/html/draft-kelly-json-hal
 */

/**
 * Retourne un Link Object, conforme à la spécification HAL
 * @param {*} url
 * @param {*} type
 * @param {*} name
 * @param {*} templated
 * @param {*} deprecation
 * @returns
 */
function halLinkObject(
  url,
  type = "",
  name = "",
  templated = false,
  deprecation = false
) {
  return {
    href: url,
    templated: templated,
    ...(type && { type: type }),
    ...(name && { name: name }),
    ...(deprecation && { deprecation: deprecation }),
  };
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un terrain
 * @param {*} fieldData Données brutes d'un terrain
 * @param {*} baseURL URL de base pour la génération des liens
 * @returns un Ressource Object Terrain (spécification HAL)
 */
function mapFieldResourceObject(fieldData, baseURL) {
  return {
    _links: {
      self: halLinkObject(`${baseURL}/fields/${fieldData.id}`),
      slots: halLinkObject(`${baseURL}/fields/${fieldData.id}/slots`),
    },
    _embedded: {
      field: fieldData,
    },
  };
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un créneau
 * @param {*} slotData Données brutes d'un créneau
 * @param {*} baseURL URL de base pour la génération des liens
 * @returns un Ressource Object Slot (spécification HAL)
 */
function mapSlotResourceObject(slotData, baseURL) {
  return {
    _links: {
      self: halLinkObject(
        `${baseURL}/fields/${slotData.fieldId}/slots/${slotData.id}`
      ),
    },
    _embedded: {
      slot: slotData,
    },
  };
}

/**
 * Retourne une représentation Ressource Object (HAL) d'une réservation
 * @param {*} reservationData Données brutes d'une réservation
 * @param {*} baseURL URL de base pour la génération des liens
 * @returns un Ressource Object Reservation (spécification HAL)
 */
function mapReservationResourceObject(reservationData, baseURL, slotData) {
  const fieldId = slotData.fieldId;
  return {
    _links: {
      self: halLinkObject(`${baseURL}/reservations/${reservationData.id}`),
      field: halLinkObject(`${baseURL}/fields/${fieldId}`),
      slot: halLinkObject(
        `${baseURL}/fields/${fieldId}/slots/${reservationData.slotId}`
      ),
    },
    _embedded: {
      reservation: reservationData,
    },
  };
}

/**
 * Retourne une représentation Ressource Object (HAL) des réservations d'un utilisateur
 * @param {*} reservationsData Liste des réservations d'un utilisateur
 * @param {*} userId ID de l'utilisateur
 * @param {*} baseURL URL de base pour la génération des liens
 * @returns un Ressource Object User Reservations (spécification HAL)
 */
function mapUserReservationsResourceObject(reservationsData, userId, baseURL) {
  const reservationsWithLinks = reservationsData.map((reservation) => ({
    ...reservation,
    _links: {
      self: halLinkObject(
        `${baseURL}/users/${userId}/reservations/${reservation.id}`
      ),
      field: halLinkObject(`${baseURL}/fields/${reservation.fieldId}`),
      slot: halLinkObject(
        `${baseURL}/fields/${reservation.fieldId}/slots/${reservation.slotId}`
      ),
    },
  }));

  return {
    _links: {
      self: halLinkObject(`${baseURL}/users/${userId}/reservations`),
    },
    _embedded: {
      reservations: reservationsWithLinks,
    },
  };
}

module.exports = {
  halLinkObject,
  mapFieldResourceObject,
  mapSlotResourceObject,
  mapReservationResourceObject,
  mapUserReservationsResourceObject,
};
