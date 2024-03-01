# Projet de Formulaire de Contact Sécurisé 🛡️

Ce projet implémente un formulaire de contact web sécurisé, mettant l'accent sur les meilleures pratiques de sécurité dès la conception. Il permet aux utilisateurs de soumettre leurs informations de contact de manière sécurisée et fiable.

## 🚀 Technologies Utilisées

- **Node.js** : Plateforme côté serveur pour exécuter JavaScript.
- **Express.js** : Framework web pour Node.js, facilitant la création de serveurs HTTP.
- **MongoDB** : Base de données NoSQL pour le stockage des informations de contact.
- **Mongoose** : ODM (Object Data Modeling) pour MongoDB, simplifiant les interactions avec la base de données.
- **ESLint** : Outil d'analyse statique pour identifier et corriger les problèmes dans le code JavaScript.
- **eslint-plugin-security** : Plugin ESLint pour détecter les vulnérabilités de sécurité dans le code.
- **Node-Forge** / **Crypto** : Bibliothèques pour le cryptage des données sensibles.

## ✨ Fonctionnalités Principales

- **Soumission Sécurisée** : Les utilisateurs peuvent soumettre leur nom, email, et un message via le formulaire de contact.
- **Validation et Assainissement** : Validation côté serveur des entrées utilisateur pour prévenir les injections et autres attaques.
- **Cryptage des Messages** : Les messages soumis sont cryptés avant d'être stockés dans la base de données.
- **HTTPS** : Communication sécurisée entre le client et le serveur pour protéger les données en transit.

## 🔒 Sécurité

- **Protection contre XSS et Injections** : Grâce à l'assainissement des entrées utilisateur.
- **Confidentialité des Données** : Utilisation du cryptage pour garantir la confidentialité des messages.
- **Analyse de Sécurité** : Utilisation d'ESLint avec le plugin de sécurité pour identifier proactivement les vulnérabilités potentielles.

## 🏁 Démarrage Rapide

Pour lancer le projet :

1. Clonez le dépôt.
2. Installez les dépendances avec `npm install`.
3. Démarrez le serveur avec `npm start`.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests ou à créer des issues pour toute question ou suggestion.
