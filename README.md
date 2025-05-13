# LaCrème CRM

Mini CRM personnel local et minimaliste pour gérer vos contacts.

## Fonctionnalités

- Ajout/modification/suppression de contacts
- Champs personnalisables (email, téléphone, site web, réseaux sociaux, documents...)
- Ajout de titres (labels) aux entrées multiples
- Recherche globale multi-critère
- Stockage local (localStorage)
- Export/Import CSV
- Interface responsive avec prise en charge du dark mode

## Lancer en local

```bash
npm install
npm run dev
```

## Export CSV

Cliquez sur **"Exporter CSV"** pour télécharger vos contacts. Chaque ligne correspond à un contact, les champs multi-entrées sont séparés par `|`.

## Import CSV

Cliquez sur **"Importer CSV"** et sélectionnez un fichier exporté au même format. Cela remplacera les contacts actuels.

## Stockage

Aucune donnée n’est envoyée à un serveur. Tout est conservé dans le `localStorage` de votre navigateur.

## Licence

MIT
