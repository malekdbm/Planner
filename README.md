# Mariage & Lune de miel 💍✈️

Application mobile (iPhone + Android) tout-en-un pour organiser le mariage en Tunisie et la lune de miel **Tunisie → Paris → Grèce → Paris**.

- Mariage : **16 juin 2026** à Tunis (Mövenpick Gammarth).
- Retour : **3 juillet 2026** à Paris.
- 17 nuits — itinéraire pré-rempli.

## Lancer l'app sur ton téléphone

```bash
npm install
npx expo start
```

- **iPhone** : installe **Expo Go** depuis l'App Store, scanne le QR code.
- **Android** : installe **Expo Go** depuis le Play Store, scanne le QR code.

Au premier lancement, l'itinéraire complet est pré-rempli.

## Fonctionnalités livrées

### Accueil
- Compte à rebours mariage + voyage
- Recherche globale
- Activités du jour, prochain vol, prochain hôtel
- Stats budget + RSVP
- 3 prochaines tâches

### Calendrier
- Vue unifiée : mariage · voyage · vols · hôtels · réservations · activités · jour J
- Filtres par type, marquage du jour
- Tap pour ouvrir le détail

### Mariage 💍
- Checklist (filtres mariage/voyage, swipe)
- Budget mariage (10 catégories pré-créées + dépenses)
- Liste d'invités & RSVP (côté, groupe, +1, régime)
- Plan de table (assigner / retirer, alertes surcapacité)
- Prestataires (contrats, acomptes, soldes, échéances)
- Playlist par moment (cérémonie · cocktail · dîner · 1ère danse · soirée · ne pas jouer)
- Photos / shot list (préparatifs · cérémonie · famille · couple · réception)
- Vœux & discours (compteur mots + temps de lecture)
- Jour J — planning minute par minute avec curseur "en cours" temps réel
- Cadeaux (liste, prix, offert par, reçu)

### Lune de miel ✈️
- Vols & ferry (ajout/édition, PNR, siège, bagages)
- Hôtels (8 séjours pré-créés, confirmation, coût, adresse)
- Réservations (voiture Crète, ferry Crète→Santorin + ajout)
- Itinéraire jour par jour (18 jours pré-créés, activités à ajouter)
- Budget voyage (7 catégories)
- Valise par catégorie (35+ articles pré-cochés, marqueur "à acheter")
- Documents (passeport, CNI, assurance, permis — alerte expiration < 6 mois après voyage)
- Journal de voyage (humeur, lieu, récit)
- Convertisseur devise (EUR · TND · USD · GBP, taux modifiables)

### Réglages
- Notifications push : tâches J-1, vols H-24 et H-3, hôtels J-1, réservations H-2
- Reset complet
- FR · EUR · JJ/MM/AAAA · 24h

## Structure du code

```
app/
├── (tabs)/         # Accueil · Calendrier · Mariage · Voyage · Réglages
├── budget/         # vue + catégories + dépenses
├── checklist/      # tâches
├── invites/        # RSVP
├── plan-table/     # plan de table
├── vendeurs/       # prestataires
├── playlist/       # musique
├── photos/         # shot list
├── voeux/          # vœux & discours
├── jour-j/         # planning du jour
├── cadeaux/        # liste cadeaux
├── vols/           # vols & ferry
├── hotels/         # hôtels & hébergements
├── reservations/   # autres
├── itineraire/     # jour par jour
├── valise/         # packing
├── documents/      # passeports etc
├── journal/        # journal de bord
├── devise/         # convertisseur
└── recherche.tsx   # recherche globale

src/
├── db/             # SQLite + seed
├── components/     # Card, Screen, DetailScreen, Field, Picker, Btn, FAB
├── utils/          # date/devise FR
├── notifications.ts# rappels push
└── theme.ts        # couleurs
```
