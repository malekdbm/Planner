# Mariage & Lune de miel 💍✈️

Application mobile (iPhone + Android) pour organiser le mariage en Tunisie et la lune de miel Paris → Crète → Santorin → Athènes → Paris.

- Mariage : **16 juin 2026** à Tunis (Mövenpick Gammarth).
- Retour : **3 juillet 2026** à Paris.
- 17 nuits — itinéraire pré-rempli.

## Lancement

```bash
npm install
npx expo start
```

Puis :

- **iPhone** : ouvre l'app **Expo Go** (App Store), scanne le QR code.
- **Android** : ouvre **Expo Go** (Play Store), scanne le QR code.

L'app démarre directement avec l'itinéraire pré-rempli au premier lancement.

## Structure

- `app/` — écrans (expo-router)
  - `(tabs)/` — onglets : Accueil · Calendrier · Mariage · Lune de miel · Réglages
  - `hotels/[id].tsx` — détail hôtel
  - `vols/[id].tsx` — détail vol
  - `reservations/[id].tsx` — détail ferry / location / autre
- `src/`
  - `db/` — SQLite (schéma + seed itinéraire)
  - `components/` — UI réutilisable
  - `utils/` — formatage date/devise (fr-FR)
  - `theme.ts` — couleurs, espacements

## Fonctionnalités v0.1 (livrées)

- Compte à rebours mariage
- Calendrier unifié (vols, hôtels, ferry, voiture, tâches)
- Liste des vols + édition (PNR, siège, classe, bagages, coût)
- Liste des hôtels + édition (confirmation, chambre, coût, téléphone, adresse)
- Réservations (ferry Crète→Santorin, voiture Crète)
- Checklist mariage avec barre de progression
- Réglages (FR, EUR, JJ/MM/AAAA, 24h) + bouton de réinitialisation

## À venir

Voir `FEATURES.md` — budget, liste d'invités, plan de table, musique, vœux, journal de voyage, météo, widgets, etc.
