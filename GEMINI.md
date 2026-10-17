# 📘 EduSaaS — Documentation Technique & Guide d'Architecture

> **EduSaaS** est une plateforme SaaS complète de gestion scolaire de haute performance, conçue selon une architecture **Offline-First (PWA)**, avec une charte graphique premium **Bleu & Blanc** adaptée aux établissements scolaires modernes (écoles primaires, collèges, lycées et instituts).

---

## 1. 🎯 Ce que fait l'application

EduSaaS permet aux directeurs, administrateurs et comptables d'écoles de piloter l'intégralité de leur établissement scolaire :
1. **Gérer les inscriptions et le registre des élèves** (avec identifiant, dates, lieu de naissance et impression de reçus d'inscription officiels).
2. **Suivre la trésorerie et les finances** (encaissements de scolarité, alertes impayés, impression individuelle de reçus de caisse / factures).
3. **Administrer les ressources humaines et la paie** (gestion du corps enseignant/administratif, salaires, fiches de paie mensuelles prêtes à imprimer).
4. **Générer des cartes scolaires avec QR Code unique** sécurisé pour vérification d'identité rapide.
5. **Monétiser le SaaS via 3 formules d'abonnement** avec période d'essai gratuit de 3 jours et formulaire de carte bancaire sécurisé.
6. **Fonctionner en continu sans connexion Internet (Offline-First)** : les directeurs peuvent continuer à enregistrer des élèves ou encaisser des frais en plein isolement réseau ; les données sont stockées en local et se synchronisent automatiquement vers le Cloud dès le retour d'Internet.

---

## 2. 🚀 Fonctionnalités Implémentées

### 2.1. Tableau de Bord Exécutif (`/dashboard`)
- **Bannière d'accueil dynamique** : Message d'accueil personnalisé (*"Bonjour, Directeur 👋"*) avec rappel des actions prioritaires et boutons d'action rapide.
- **Cartes KPI en temps réel** : Total des élèves inscrits, total des paiements scolarité encaissés, masse salariale mensuelle et ratio des impayés avec pourcentages d'évolution.
- **Graphique d'analyse financière** : Courbes de suivi des encaissements via la librairie **Recharts**.
- **Flux d'activités récentes** : Historique visuel des dernières opérations scolaires et comptables.

### 2.2. Élèves & Inscriptions (`/dashboard/students`)
- **Base de données locale (IndexedDB)** : Lecture et écriture réactives via `Dexie.js` sans blocage réseau.
- **Fiche élève enrichie** : Nom, prénom, matricule unique, classe, **date de naissance** et **lieu de naissance**, date d'inscription.
- **Recherche & Filtres** : Recherche instantanée en temps réel par nom ou prénom.
- **Statut de synchronisation visuel** : Indicateur vert `Cloud` ou jaune clignotant `Local (En attente)`.
- **Double mode d'impression** :
  - *Impression de la liste complète* des élèves de l'établissement.
  - *Impression individuelle du reçu d'inscription* : Reçu scolaire officiel contenant le détail des frais d'inscription, les frais annexes, la **Somme Payée (Net en F CFA)**, l'encadré pour signature administrative, et une fermeture automatique intelligente après impression.

### 2.3. Finances & Impayés (`/dashboard/finances`)
- **Suivi de caisse** : Indicateurs clés (Total Encaissé vs Total Impayés).
- **Historique des transactions** : Tableau des paiements avec statut vert (`Payé`) ou rouge (`Impayé`).
- **Enregistrement de paiement hors ligne** : Ajout instantané en local avec mise à jour automatique des métriques.
- **Double mode d'impression** :
  - *Impression du journal financier complet*.
  - *Impression individuelle du reçu de paiement / facture de caisse* : Document numéroté (`FAC-XXXX`) précisant l'élève, la classe, le motif (trimestre de scolarité), le montant net réglé, et la mention pour visa comptable avec fermeture automatique.

### 2.4. Ressources Humaines & Paie (`/dashboard/hr`)
- **Registre du personnel** : Liste complète des enseignants et employés avec poste, date d'embauche, salaire mensuel et statut (`Actif` / `Inactif`).
- **Ajout d'employé en local** : Fonctionnel à 100 % hors-ligne.
- **Double mode d'impression** :
  - *Impression du registre RH*.
  - *Impression individuelle du Bulletin de Paie Mensuel* : Document officiel détaillant le salaire brut, les cotisations, les primes, le Net à Payer, le mois concerné et l'encadré pour signature de l'employeur.

### 2.5. Cartes Scolaires avec QR Code (`/dashboard/cards`)
- **Badges scolaires professionnels** : Affichage au format carte d'identité scolaire (photo, nom, matricule, classe, année scolaire, nom de l'école).
- **QR Code vectoriel dynamique** : Généré via `qrcode.react`, pointant vers une URL de vérification d'authenticité de l'élève.
- **Bouton d'impression du lot** : Permet l'impression directe des badges pour plastification.

### 2.6. Abonnements SaaS & Monétisation (`/dashboard/billing`)
- **3 Formules d'abonnement conformes aux spécifications** :
  - **Mensuel** : `14 000 F CFA / mois`
  - **Trimestriel** : `50 000 F CFA / trimestre` (Économie de 2 000 F CFA)
  - **Annuel** : `140 000 F CFA / an` (Économie de 28 000 F CFA)
- **3 Jours d'essai gratuit** : Badge vert distinctif et mention légale explicite sur chaque formule.
- **Modale de souscription (Checkout sécurisé)** :
  - Saisie de l'adresse email de l'administrateur.
  - Saisie du numéro de téléphone.
  - Saisie des informations bancaires (Numéro de carte, MM/AA, CVC).
  - Mention légale : *"Votre essai gratuit dure 3 jours. Si vous n'annulez pas avant la fin de cette période, l'abonnement sera activé automatiquement. Vous pouvez annuler à tout moment sans frais pendant ces 3 jours."*

### 2.7. Paramètres de l'Établissement (`/dashboard/settings`)
- Configuration de l'identité de l'école : Nom de l'établissement, logo, adresse complète, numéro de téléphone et email officiel de contact.

### 2.8. Moteur Hors-Ligne (Offline-First) & Synchronisation
- **Base locale IndexedDB** via `Dexie.js` pour les tables `students`, `finances`, `hr`.
- **Composant `SyncEngine`** : Écoute en arrière-plan les événements `window.online` et `window.offline`.
- **Indicateur d'état réseau** :
  - Bannière rouge flottante animée en cas de coupure Internet (*"Mode Hors Ligne : Les modifications sont sauvegardées localement"*).
  - Bannière bleue tournante lors du rétablissement (*"Réseau rétabli : Synchronisation au cloud en cours..."*).
- **Architecture PWA** : Service Worker (`sw.js`) généré avec `@serwist/next` et manifeste PWA (`manifest.json`) pour mise en cache complète des interfaces.

---

## 3. 📂 Structure des Fichiers

```text
edusaas/
├── public/
│   ├── manifest.json            # Manifeste PWA (icônes, thème, mode standalone)
│   └── sw.js                    # Service worker généré automatiquement par Serwist
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── billing/
│   │   │   │   └── page.tsx     # Page des abonnements avec modale de paiement
│   │   │   ├── cards/
│   │   │   │   └── page.tsx     # Génération de cartes scolaires avec QR Code
│   │   │   ├── finances/
│   │   │   │   └── page.tsx     # Wrapper SSR pour les finances
│   │   │   ├── hr/
│   │   │   │   └── page.tsx     # Wrapper SSR pour les ressources humaines
│   │   │   ├── settings/
│   │   │   │   └── page.tsx     # Formulaire des paramètres de l'école
│   │   │   ├── students/
│   │   │   │   └── page.tsx     # Wrapper SSR pour les élèves
│   │   │   ├── layout.tsx       # Layout horizontal du dashboard avec Header et SyncEngine
│   │   │   └── page.tsx         # Dashboard principal (KPIs, Recharts, bannières)
│   │   ├── fonts/               # Polices locales Geist VF
│   │   ├── globals.css          # Styles globaux Tailwind CSS
│   │   ├── layout.tsx           # Root layout avec métadonnées et viewport PWA
│   │   ├── page.tsx             # Redirection automatique vers /dashboard
│   │   └── sw.ts                # Configuration du Service Worker Serwist
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx       # En-tête horizontal, logo SVG personnalisé, navigation
│   │   ├── ClientFinances.tsx   # Gestion IndexedDB des finances + reçus de paiement
│   │   ├── ClientHR.tsx         # Gestion IndexedDB des RH + bulletins de paie
│   │   ├── ClientStudents.tsx   # Gestion IndexedDB des élèves + reçus d'inscription
│   │   └── SyncEngine.tsx       # Moteur d'écoute réseau & notification de synchronisation
│   └── lib/
│       └── db.ts                # Schéma IndexedDB Dexie.js (tables, versions, types)
├── next.config.mjs              # Configuration Next.js avec wrapper Serwist
├── package.json                 # Dépendances du projet et scripts
├── postcss.config.mjs           # Configuration PostCSS
├── tailwind.config.ts           # Configuration Tailwind CSS
└── tsconfig.json                # Configuration TypeScript
```

---

## 4. 🛠️ Technologies Utilisées

| Domaine | Technologie | Rôle / Justification |
| :--- | :--- | :--- |
| **Framework Web** | `Next.js 14` (App Router) | Framework React de classe mondiale, support SSR/SSG hybride, performances maximales. |
| **Langage** | `TypeScript 5` | Typage strict garantissant la robustesse du modèle de données (élèves, finances, contrats). |
| **Styling & UI** | `Tailwind CSS 3` | Design sur-mesure ultra-rapide, thème bleu et blanc institutionnel, classes utilitaires. |
| **Icônes** | `lucide-react` | Jeu d'icônes vectorielles cohérentes et modernes pour toute l'interface. |
| **Base de Données Locale** | `Dexie.js 4` + `dexie-react-hooks` | Wrapper IndexedDB haute performance pour requêtes réactives et persistance hors-ligne. |
| **PWA & Cache Hors-Ligne** | `@serwist/next` + `serwist` | Service worker nouvelle génération pour mise en cache des assets et navigation hors-ligne. |
| **Visualisation Données** | `recharts 3` | Graphiques interactifs et responsives pour les encaissements financiers. |
| **Sécurité & Identité** | `qrcode.react 4` | Génération de QR Codes vectoriels SVG pour les cartes d'élèves. |
| **Cloud & Authentification** | `@supabase/supabase-js`, `@supabase/ssr` | Prévu pour la synchronisation distante PostgreSQL et l'authentification sécurisée. |

---

## 5. 🎨 Décisions de Design & UX

1. **Charte Graphique Bleu & Blanc Institutionnelle** :
   - Fondations en bleu marine profond (`#1e3a8a`, `bg-blue-900`) évoquant le sérieux, la rigueur académique et la confiance financière.
   - Accents en bleu ciel (`#38bdf8`) et vert émeraude (`#10b981`) pour les validations, les abonnements et les rentrées d'argent.
   - Textes contrastés sur fond blanc ou gris clair (`#f9fafb`) pour une lisibilité optimale lors d'utilisations prolongées.
2. **Navigation 100 % Horizontale (Top Navigation Bar)** :
   - Conforme à la demande explicite de l'utilisateur.
   - Évite d'encombrer l'écran avec une barre latérale, maximisant l'espace horizontal pour les grands tableaux de scolarité et de comptabilité.
3. **Logo SVG Vectoriel Moderne Dédié** :
   - Formes géométriques superposées rappelant à la fois un livre ouvert, un toît d'école et une toque de remise de diplôme avec des reflets dégradés.
4. **Impression Découplée (@media print)** :
   - Tous les reçus et bulletins s'affichent dans des modales élégantes.
   - Lors de l'appui sur "Lancer l'impression", le reste de la page (`Header`, tableaux, boutons) est masqué par CSS print (`print:hidden`), garantissant une sortie papier ou PDF standardisée A4.
   - Fermeture automatique du dialogue à l'ouverture de l'impression pour un flux de travail fluide.
5. **Résolution des Conflits SSR / IndexedDB** :
   - `IndexedDB` n'existant que dans le navigateur, les pages dynamiques utilisent un pattern de séparation : `page.tsx` importe le composant client via `next/dynamic` avec `{ ssr: false }`. Cela élimine les erreurs d'hydratation Next.js.

---

## 6. 🤖 Instructions pour Modèles IA (Directives de Maintenance & Évolution)

Si un agent ou modèle IA doit reprendre ou faire évoluer ce codebase, voici les **règles impératives** à respecter :

### 6.1. Règle d'or : Respecter l'Architecture Offline-First
- **Ne jamais court-circuiter IndexedDB** : Toute création ou modification de donnée (élève, transaction, employé) doit **d'abord** être enregistrée dans `db` (Dexie.js dans `src/lib/db.ts`) avec le flag `syncStatus: 'pending_insert' | 'pending_update'`.
- La synchronisation vers Supabase doit se faire en tâche de fond (Background Sync) via le hook ou composant `SyncEngine`.
- En cas d'ajout d'une nouvelle table, toujours incrémenter la version du schéma dans `db.ts` (`this.version(N).stores(...)`).

### 6.2. Règle d'hydratation Next.js & Composants Clients
- Tout composant utilisant `useLiveQuery` de `dexie-react-hooks` ou accédant à `window` / `navigator` doit impérativement être un composant client (`'use client'`) et être importé dans les pages Next.js via `dynamic(() => import(...), { ssr: false })`.
- Ne pas supprimer les fichiers wrappers `page.tsx` dans `students`, `finances` ou `hr`.

### 6.3. Style et Cohérence Visuelle
- Conserver le code couleur :
  - Primaire : `blue-900` (#1e3a8a) et `blue-600`.
  - Succès / Payé : `green-600` et `bg-green-50`.
  - Retard / Impayé : `red-600` et `bg-red-50`.
  - Fond de page : `bg-gray-50`.
- Toujours utiliser `lucide-react` pour les icônes.

### 6.4. Impression et Modales
- Si vous créez un nouveau type de document imprimable (bulletin de notes, certificat de scolarité), toujours entourer le reste de la page avec la classe conditionnelle `print:hidden` lorsque la modale est active, et appliquer les classes `print:shadow-none print:w-full` sur le conteneur du document.
- Toujours penser à réinitialiser l'état (`setOpen(null)`) après appel à `window.print()`.

### 6.5. Commandes de Démarrage & Environnement
- Démarrer le serveur de développement :
  ```powershell
  $env:PATH = "C:\Program Files\nodejs\;" + $env:PATH; npm.cmd run dev
  ```
- Tester le build de production :
  ```powershell
  $env:PATH = "C:\Program Files\nodejs\;" + $env:PATH; npm.cmd run build
  ```
