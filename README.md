# Ailleurs — site de voyage

Application React + TypeScript (Vite) : recherche de **n'importe quelle ville du monde**
(géocodage Open-Meteo), 20 destinations éditoriales enrichies, pages villes (lieux,
**événements réels en temps réel**, météo en direct) et pages événements avec hébergements
réels à proximité. Aucune donnée d'événement inventée : tout vient d'APIs.

Deux types de pages ville :
- `/ville/:id` — nos 20 destinations éditoriales (lieux choisis, photos vérifiées) ;
- `/decouvrir?nom=…&lat=…&lon=…` — **toutes les autres villes** : présentation et lieux
  notables tirés de Wikipédia en direct, météo et événements en temps réel.

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # vérification TypeScript + build de production (dist/)
npm run preview  # prévisualiser le build de production
```

## Structure

```
src/
  main.tsx               # point d'entrée (React Router)
  App.tsx                # routes : /, /ville/:id, /evenement/:id, /experiences, /evenements
  index.css              # styles globaux (design "Ailleurs")
  types.ts               # types du domaine (City, CityEvent, Lodging…)
  data/destinations.ts   # agrégateur des villes + constantes partagées
  data/images.ts         # toutes les URLs de photos vérifiées (clé -> URL)
  data/cities/           # un fichier par ville (20 destinations)
  services/overpass.ts   # hébergements réels autour d'un lieu (API Overpass / OpenStreetMap)
  services/weather.ts    # météo actuelle des villes (API Open-Meteo)
  hooks/useAsync.ts      # état loading / ready / error pour les appels API
  components/            # Header, Footer, icônes, CoverImage, CategoryFilter…
  pages/                 # Home, City, Event, Experiences, Events
```

## APIs utilisées

- **Ticketmaster Discovery** (clé gratuite requise, voir `.env.example`) — événements réels
  (concerts, spectacles, expos, matchs) dans un rayon de 50 km autour de chaque ville, avec
  billetterie officielle. Deux tris (« Par date » et « À la une », le classement par pertinence
  de Ticketmaster), filtres de période (aujourd'hui / 7 jours / 30 jours) et une sélection
  limitée à 2 événements par jour pour étaler la liste sur les prochaines dates. Couverture forte : Londres, New York, Miami, Montréal, Mexico, Berlin,
  Amsterdam, Barcelone, Prague, Istanbul, Rio, Le Cap, Rome. Faible/absente : France, Portugal,
  Japon, Thaïlande, Maroc (l'interface l'indique honnêtement).
- **OpenAgenda** (clé gratuite requise, voir `.env.example`) — événements culturels réels
  partout en France (festivals, expos, concerts, ateliers) : comble le trou de couverture
  de Ticketmaster pour les villes françaises. S'active automatiquement dès que la clé
  `VITE_OPENAGENDA_KEY` est présente.
- **« Que faire à Paris ? »** (open data Ville de Paris, sans clé) — événements parisiens réels,
  fusionnés avec les autres sources sur la page Paris.
- **Overpass (OpenStreetMap)** (sans clé) — vrais hôtels, maisons d'hôtes, locations et auberges
  dans un rayon de 1,5 km autour du lieu réel de chaque événement, avec bascule automatique
  entre plusieurs serveurs publics. Données © contributeurs OpenStreetMap.
- **Google Places (New)** (clé facultative, voir `.env.example`) — vraies photos des
  hébergements de la section « Où dormir à proximité » (recherche du lieu par nom autour de
  ses coordonnées OSM, mise en cache 7 jours pour économiser le quota). Sans clé, ou si un
  établissement n'a pas de photo, repli sur les photos d'illustration.
- **Open-Meteo** (sans clé) — météo actuelle affichée sur chaque page ville, et **géocodage**
  de la recherche mondiale (toutes les villes de la planète).
- **Wikipédia** (sans clé) — sur les pages « découverte » : résumé de la ville, photo principale
  et lieux notables illustrés dans un rayon de 10 km, **catégorisés** (Musées & art, Patrimoine,
  Places & rues, Nature, Culture) avec filtres pour l'utilisateur ; tribunaux, préfectures,
  écoles et autres bâtiments administratifs sont exclus.
- Les photos des villes et lieux proviennent de Wikimedia Commons et d'Unsplash (URLs vérifiées),
  celles des événements viennent des APIs.

L'appel Ticketmaster passe par le proxy du serveur Vite (`/api/tm`, voir `vite.config.ts`).
Les réponses API sont mises en cache 15 à 30 min dans la session du navigateur.

Les fichiers `Ailleurs.dc.html` et `support.js` sont la maquette d'origine (conservés pour référence).
