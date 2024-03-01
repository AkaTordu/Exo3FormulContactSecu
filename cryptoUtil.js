const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// Pour une sécurité accrue, stockez ces clés dans des variables d'environnement ou utilisez un service de gestion des secrets
const secretKey = 'votre_clé_secrète_ici'; // Doit être de 32 octets pour aes-256-cbc
const iv = crypto.randomBytes(16); // Vecteur d'initialisation

// Fonction pour crypter du texte
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Fonction pour décrypter du texte
function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };