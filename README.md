# RWYSE | Rise with you — Contemporary Streetwear & Luxury Apparel

> Flagship E-Commerce Platform & Sovereign Admin Command Suite for **RWYSE** (Tunisia). Engineered with modern web standards, brutalist luxury aesthetics, high-density 500 GSM loopback cotton styling, and real-time cloud synchronization.

---

## 🌟 Aperçu du Projet & Fonctionnalités

### 🛍️ Boutique Client (Storefront)
- **Design Haute Couture Streetwear** : Esthétique soignée inspirée des grandes maisons (Fear of God, Balenciaga, Represent, Corteiz) avec typographies *Syne* et *Plus Jakarta Sans*.
- **Animations Fluides sur Tout le Site** : Micro-interactions, transitions de pages, affichage échelonné des produits (*staggered animations* avec `motion`), zooms subtils et crossfades.
- **Visionneuse Interactive 360° & Multi-angles** : Permet au client de faire tourner le vêtement sous tous les angles.
- **Simulateur de Taille Intelligent (Fit Guide)** : Recommandation de taille dynamique selon le poids et la taille du client.
- **Tunnel de Commande & Paiement à la Livraison (Cash on Delivery - COD)** :
  - Frais de livraison forfaitaires de **8 DT** vers tous les gouvernorats de Tunisie.
  - Sauvegarde instantanée de la commande dans la base de données Cloud **Firebase Firestore** et dans le stockage local.
  - Page de confirmation immédiate avec numéro de commande et lien de suivi en direct.
- **Suivi de Commande en Temps Réel (`#track`)** : Étapes d'expédition interactives (En attente → Confirmée → En préparation → Expédiée → Livrée).
- **Lookbook & Capsules Éditoriales** : Mise en valeur des photos de campagne officielles RWYSE (Pull Royal Blue 567, Pantalon Balloon, T-shirt Ringer Medina, etc.).

---

### 🛡️ Espace Administrateur Souverain (`#admin`)
Accès sécurisé avec authentification à double facteur (2FA) :
- **URL** : Accédez à la route `/admin` (ou `#admin`)
- **Identifiant (Email)** : `admin@rwyse.tn`
- **Mot de passe** : `rwyse2026`
- **Code 2FA (PIN)** : `567001` (ou `2026`)

#### Fonctionnalités Admin :
1. **Gestion des Commandes en Direct (`AdminOrders`)** :
   - Synchronisation Firestore en temps réel (*onSnapshot*) : dès qu'un client passe commande, elle s'affiche immédiatement.
   - Mise à jour du statut en un clic (En attente, Confirmée, En cours, Expédiée, Livrée, Annulée).
   - Bouton WhatsApp direct pour contacter le client en 1 clic avec le récapitulatif.
   - Suppression sécurisée des commandes de test.
2. **Médiathèque & Gestion de TOUTES les Images du Site (`AdminMediaManager`)** :
   - **Image Principale Hero (Accueil)** : Téléversement direct depuis l'ordinateur, saisie d'URL ou sélection parmi les 10 photos officielles RWYSE.
   - **Bannières Spotlight 567** : Packshot studio et photo portée avec prévisualisation en direct.
   - **Galerie Lookbook (4 Looks)** : Modification individuelle des 4 photos exposées sur la page d'accueil.
   - **Photos Ethos & Philosophie** : Gestion des visuels du manifeste de marque.
   - **Bannière Éditoriale** : Visuel panoramique haute définition.
   - **Médiathèque Personnelle** : Import de photos en masse et assignation en 1 clic à n'importe quel emplacement du site.
3. **Contrôle de la Page d'Accueil (`AdminHomepage`)** :
   - Personnalisation des titres, sous-titres, boutons et liens CTA.
   - Bandeau défilant d'annonce (Marquee ticker).
   - Activation / désactivation des sections (Drop, Communauté, Instagram).
4. **Catalogue de Produits & Stocks (`AdminProducts`)** :
   - Ajout, modification, duplication et suppression de pièces.
   - Gestion des stocks par taille (S, M, L, XL, XXL) avec alertes de stock faible.
   - Configuration des séquences photos 360°.
5. **Gestion des Prix & Marges (`AdminPriceManagement`)** : Calcul des marges brutes, gestion des prix barrés et promotions.
6. **Codes Promo & Bannières (`AdminPromotions`, `AdminAdvertisements`)**.
7. **Clients & Profils d'Achat (`AdminCustomers`)**.
8. **Journal d'Audit de Sécurité (`AdminAuditLogs`)**.

---

## 🚀 Déploiement : GitHub & Vercel

### 1. Hébergement sur GitHub

Pour initialiser le dépôt Git et l'envoyer sur votre compte GitHub :

```bash
# 1. Initialiser le dépôt local
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Créer le commit initial
git commit -m "feat: initial commit - RWYSE Luxury Streetwear platform ready for production"

# 4. Renommer la branche principale
git branch -M main

# 5. Lier votre dépôt GitHub (remplacez par votre URL)
git remote add origin https://github.com/VOTRE_PSEUDO/rwyse-store.git

# 6. Envoyer le code
git push -u origin main
```

---

### 2. Déploiement sur Vercel

Le projet est configuré avec un fichier `vercel.json` qui gère automatiquement les réécritures d'URL pour le routage SPA (Single Page Application).

1. Rendez-vous sur [Vercel](https://vercel.com) et connectez votre compte GitHub.
2. Cliquez sur **"Add New..."** → **"Project"**.
3. Sélectionnez le dépôt `rwyse-store`.
4. Vercel détecte automatiquement :
   - **Framework Preset** : `Vite`
   - **Build Command** : `vite build`
   - **Output Directory** : `dist`
5. *(Optionnel)* Si vous souhaitez configurer des variables d'environnement personnalisées :
   - `GEMINI_API_KEY` (si vous activez les fonctionnalités d'analyse d'images)
6. Cliquez sur **Deploy**.
7. Votre site sera en ligne en moins d'une minute avec un nom de domaine gratuit `.vercel.app` (et possibilité de connecter un domaine personnalisé comme `rwyse.tn`).

---

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Vite 8
- **Styles** : Tailwind CSS v4, Google Fonts (*Syne*, *Plus Jakarta Sans*, *Cabinet Grotesk*)
- **Animations** : Motion (`motion/react`)
- **3D / 360 Viewer** : Three.js & Visionneuse interactive multi-frames
- **Base de Données & Auth** : Firebase Firestore 12 (Temps réel avec mode hors-ligne gracieux)
- **Icônes** : Lucide React

---

## 📦 Commandes Utiles en Local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement local
npm run dev

# Compiler pour la production
npm run build

# Vérifier la validité TypeScript
npm run lint
```

---

© 2026 RWYSE Studios. Tous droits réservés. "Rise with you."
