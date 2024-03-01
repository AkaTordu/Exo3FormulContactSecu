const express = require('express');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const https = require('https');
const { encrypt, decrypt } = require('./cryptoUtil');
const forge = require('node-forge');

const app = express();
const PORT = 3000;

// Configuration des middlewares
app.use(express.json());
app.use(express.static('.'));
app.use(helmet());
app.use(cookieParser());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
    },
}));

// Configuration CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

// Configuration de la limitation de taux
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limite chaque IP à 100 requêtes par fenêtre
});

app.use('/send', limiter);

// Route d'envoi
app.post('/send', [
    body('name').trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    console.log(`Message reçu de ${name} (${email}): ${message}`);
    // Traitez et stockez/envoyez les données ici de manière sécurisée
    res.json({status: 'Message envoyé avec succès'});
});

// Exemple d'une route pour recevoir et crypter les données avant de les stocker
app.post('/send-message', [
    body('name').trim().escape().isLength({ min: 1 }).withMessage('Le nom est obligatoire.'),
    body('email').isEmail().withMessage('Une adresse email valide est obligatoire.').normalizeEmail(),
    body('message').trim().escape().isLength({ min: 1 }).withMessage('Le message ne peut pas être vide.'),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, message } = req.body;
    const encryptedMessage = encrypt(message); // Cryptez le message ici
  
    // Créez une nouvelle instance de votre modèle Message et sauvegardez-la dans la base de données
    const newMessage = new Message({
      name,
      email,
      message: encryptedMessage
    });
  
    try {
      await newMessage.save(); // Sauvegardez le message dans la base de données
      console.log(`Message crypté et enregistré : ${encryptedMessage}`);
      res.send('Message reçu et crypté avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message dans la base de données', error);
      res.status(500).send('Erreur lors du traitement de votre message');
    }
});
  
app.get('/get-message/:id', async (req, res) => {
    try {
      const messageId = req.params.id;
      const message = await Message.findById(messageId); // Trouvez le message par son ID
  
      if (!message) {
        return res.status(404).send('Message non trouvé');
      }
  
      const decryptedMessage = decrypt(message.message); // Déchiffrez le message crypté
      console.log(`Message décrypté : ${decryptedMessage}`);
      res.send(`Message décrypté : ${decryptedMessage}`);
    } catch (error) {
      console.error('Erreur lors de la récupération du message', error);
      res.status(500).send('Erreur lors de la récupération du message');
    }
});

// Générer une paire de clés et un certificat auto-signé
const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
const attrs = [{
  name: 'commonName',
  value: 'localhost'
}, {
  name: 'countryName',
  value: 'US'
}, {
  shortName: 'ST',
  value: 'Virginia'
}, {
  name: 'localityName',
  value: 'Blacksburg'
}, {
  name: 'organizationName',
  value: 'Test'
}, {
  shortName: 'OU',
  value: 'Test'
}];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

const pem = {
  private: pki.privateKeyToPem(keys.privateKey),
  cert: pki.certificateToPem(cert)
};

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nomDeVotreBaseDeDonnees', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true } // Pensez à stocker le message crypté si c'est ce que vous préférez
});
const Message = mongoose.model('Message', messageSchema);  

// Créer le serveur HTTPS
const server = https.createServer({
  key: pem.private,
  cert: pem.cert
}, app);

server.listen(3000, () => {
  console.log('Server running on https://localhost:3000');
});