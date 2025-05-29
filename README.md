# LaCrème CRM

Une mini application CRM légère et personnelle, pour gérer ses contacts comme dans un carnet de notes moderne.  
Idéale pour garder une trace des échanges humains sans la lourdeur d’un vrai CRM.

[🔁 Partage via Pairdrop](https://pairdrop.net)

## ✨ Fonctionnalités

- Ajout, modification et suppression de contacts
- Champs personnalisés : nom, entreprise, tags, idées, photos, email, réseaux...
- Import / export de fichiers CSV
- Import / export **chiffrés en AES** (sécurité renforcée)
- Synchronisation facile via Pairdrop (mobile ↔ PC)
- Stockage **local uniquement** (aucune donnée côté serveur)
- Affichage des photos LinkedIn via un proxy

## 🚀 Installation

```bash
git clone https://github.com/ton-utilisateur/la-creme-crm.git
cd la-creme-crm
npm install
npm run dev
```

## 🔐 Export CSV chiffré

- Les fichiers exportés peuvent être protégés par une phrase secrète.
- L’import nécessite la même phrase pour déchiffrer.
- Format AES-GCM, sécurisé côté navigateur.
- Aucune donnée ne quitte ton appareil.

## 📦 Utilisation d’un fichier `.env`

Certaines fonctionnalités (comme l’affichage des photos LinkedIn) utilisent un proxy nécessitant une clé secrète.  
Ajoute un fichier `.env.local` à la racine du projet avec la variable suivante :

```
IMAGE_PROXY_SECRET=ta-clé-secrète
```

Sans cette variable, les images distantes ne seront pas affichées.

## 📤 Synchronisation entre appareils

Tu peux transférer tes fichiers CSV manuellement en toute sécurité via :

👉 [https://pairdrop.net](https://pairdrop.net)

- Compatible mobile, desktop, navigateur
- Chiffrement bout-en-bout
- Pas d’installation nécessaire

## 🛠 À venir

- Import/export JSON chiffré
- Connecteurs vers X, Telegram, LinkedIn, WhatsApp...
- IA locale pour suggestions de suivi ou résumés d'interactions
- Gestion d’agenda ou rappels intégrée

## 🧠 Philosophie

Ce projet est conçu pour être un outil personnel, léger, et respectueux de la vie privée.  
Pas de cloud, pas d’inscription, pas de traçage.  
Un simple carnet numérique qui te rend la mémoire.

---

Développé avec ❤️ par un explorateur du lien humain.
