# 🚚 Ops BIA — Bourse Inter‑Agence + Export CSV + Cartes (Railway Ready)

**Stack**: Next.js (App Router) • Tailwind • Prisma • PostgreSQL • Leaflet (OpenStreetMap)

## Fonctions clés
- **Bourse Inter‑Agence** : OFFRES (capacités) & BESOINS, matching en 1 clic → création d’une **Expédition**.
- **Export CSV** : `/api/export/offers`, `/api/export/needs`, `/api/export/shipments` (boutons dans l’UI).
- **Cartes** : visualisation des expéditions (lignes) et des origines/destinations des OFFRES/BESOINS (points).

## Démarrage local
```bash
cp .env.example .env.local        # -> set DATABASE_URL (Railway Postgres ou local)
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
# http://localhost:3000
```

## Déploiement Railway
1. Projet Railway + add-on **PostgreSQL** (la variable `DATABASE_URL` est fournie).
2. Déploie le repo (GitHub). Build: `prisma generate && next build` — Start: `prisma generate && next start -p $PORT`
3. Shell Railway (une fois) :
```bash
npx prisma migrate deploy
npm run seed  # optionnel
```
4. Ouvre `/bia` (bourse), `/shipments`, `/map` (cartes).

## Modèle de données
- `City(name, lat, lon)` : villes FR de base pour calcul distance & affichage carte (seed).
- `Agency` : agences.
- `Offer` / `Need` : bourse inter‑agence (status `OPEN|MATCHED|CANCELLED`).
- `Shipment` : expéditions (avec `distanceKm` calculée si villes connues).

## CSV
- OFFRES: `/api/export/offers`
- BESOINS: `/api/export/needs`
- EXPÉDITIONS: `/api/export/shipments`

Chaque endpoint renvoie un fichier CSV (séparateur `;`).

## Cartes
- Basé sur **Leaflet** + tuiles OpenStreetMap (pas de clé API).
- Ajoute des villes dans `City` pour enrichir l’affichage et le calcul des distances (Haversine).

---

Astuce: Pour l’auto-complétion des villes et la *distance dynamique*, crée une page d’admin `City` et alimente 35k communes FR (BAN/IGN) — ou plug un service de géocodage. Ce starter est volontairement simple et autonome (offline).
