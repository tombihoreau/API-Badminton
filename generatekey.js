const crypto = require('crypto');
const fs = require('fs');
//Générer une clef aléatoire de 32 bytes (256 bits)
const secret = crypto.randomBytes(32).toString('hex');
fs.writeFileSync('api/private.key', secret);