# Easinvoice en local

Application personnelle pour gérer ses clients, créer et modifier des devis et factures, les finaliser et télécharger leurs PDF. Aucun compte, abonnement, serveur Supabase, paiement Stripe ou fichier `.env.local` n'est nécessaire.

## Démarrer

Prérequis : Node.js 22.18 ou plus récent (Node.js 24 conseillé) et npm.

```sh
npm install
npm run dev
```

Ouvrir **http://localhost:3000**. Le serveur écoute uniquement sur l'interface locale de l'ordinateur. Garder le terminal ouvert pendant l'utilisation ; `Ctrl+C` arrête l'application.

Pour utiliser la version compilée :

```sh
npm run build
npm start
```

## Utilisation

1. Renseigner les informations de l'émetteur et éventuellement son logo PNG/JPG dans **Mon entreprise**. La section **Coordonnées bancaires** permet d'ajouter le titulaire du compte, la banque, l'IBAN et le BIC/SWIFT sur les factures. Ces champs sont facultatifs et sont conservés dans chaque facture lors de sa finalisation.
2. Ajouter un client depuis **Clients**, ou directement dans le formulaire d'un document.
3. Créer un devis ou une facture, saisir les lignes et la TVA, puis enregistrer le brouillon.
4. Vérifier le PDF et finaliser le document pour attribuer son numéro : `D20260001` pour un devis, `F20260001` pour une facture. Les compteurs sont séparés par type et année. Un document finalisé ne peut plus être modifié.
5. Télécharger le PDF depuis sa fiche.

## Données et sauvegardes

Les informations sont conservées **sur disque**, dans `.data/easinvoice.json`, indépendamment du navigateur. Elles restent disponibles après un redémarrage de l'application. Le dossier `.data` est exclu de Git. Le logo est inclus dans les données du profil.

Dans **Paramètres**, utiliser **Télécharger une sauvegarde JSON** pour télécharger un fichier JSON contenant le profil, les clients, les documents et les compteurs. **Restaurer une sauvegarde** remplace les données actuelles après confirmation et validation du fichier ; une copie des données précédentes est conservée dans le dossier de stockage. Conserver une copie régulière des exports ailleurs sur l'ordinateur ou un disque externe. Si le fichier local devient illisible, une page de récupération permet de restaurer un export sans effacer le fichier endommagé.

Pour choisir un autre dossier, définir `EASINVOICE_DATA_DIR` dans un fichier `.env.local` (ce doit être un **fichier**, pas un dossier) :

```dotenv
EASINVOICE_DATA_DIR=/chemin/vers/mes-donnees-easinvoice
```

Sans ce réglage, l'application utilise simplement `.data` dans le projet. Les anciennes données Supabase ne sont pas importées automatiquement : la version locale démarre avec un profil vide et aucun document.

## Vérification

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Les tests de stockage utilisent un dossier temporaire et ne touchent pas aux données personnelles.
