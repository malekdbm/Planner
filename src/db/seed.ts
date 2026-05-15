import type { SQLiteDatabase } from 'expo-sqlite';

export async function seedIfEmpty(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM meta WHERE key = 'seeded_v2'`,
  );
  if (row?.value === '1') return;

  await db.execAsync('BEGIN');
  try {
    await db.execAsync(`
      DELETE FROM hotels;
      DELETE FROM flights;
      DELETE FROM reservations;
      DELETE FROM tasks;
      DELETE FROM budget_categories;
      DELETE FROM packing;
      DELETE FROM shot_list;
      DELETE FROM playlist;
      DELETE FROM vows;
      DELETE FROM documents;
      DELETE FROM day_of;
      DELETE FROM tables_plan;
      DELETE FROM activities;
      DELETE FROM vendors;
    `);

    await db.runAsync(
      `INSERT INTO hotels (name, city, country, checkin, checkout, nights, kind, notes) VALUES
        (?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?)`,
      [
        'Mövenpick Gammarth', 'Gammarth, Tunis', 'Tunisie', '2026-06-16', '2026-06-17', 1, 'hotel', 'Nuit du mariage',
        'Hôtel à Monastir', 'Monastir', 'Tunisie', '2026-06-17', '2026-06-20', 3, 'hotel', 'À préciser',
        'Chez mes parents', 'Tunis', 'Tunisie', '2026-06-20', '2026-06-22', 2, 'family', 'Famille',
        'Hôtel à Hammamet', 'Hammamet', 'Tunisie', '2026-06-22', '2026-06-23', 1, 'hotel', 'À préciser',
        'Hôtel à Paris', 'Paris', 'France', '2026-06-23', '2026-06-25', 2, 'hotel', 'À préciser',
        'Hôtel à Héraklion / Crète', 'Héraklion', 'Grèce', '2026-06-25', '2026-06-30', 5, 'hotel', 'Voiture de location 5 jours',
        'Hôtel à Santorin', 'Santorin', 'Grèce', '2026-06-30', '2026-07-02', 2, 'hotel', 'Arrivée en ferry depuis la Crète',
        'Hôtel à Athènes', 'Athènes', 'Grèce', '2026-07-02', '2026-07-03', 1, 'hotel', 'À préciser',
      ],
    );

    await db.runAsync(
      `INSERT INTO flights (airline, flight_no, from_code, from_city, to_code, to_city, depart_at, kind, notes) VALUES
        (?,?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?,?),(?,?,?,?,?,?,?,?,?)`,
      [
        '', '', 'TUN', 'Tunis', 'CDG', 'Paris', '2026-06-23T10:00:00', 'flight', 'À réserver',
        '', '', 'CDG', 'Paris', 'HER', 'Héraklion', '2026-06-25T10:00:00', 'flight', 'À réserver',
        '', '', 'JTR', 'Santorin', 'ATH', 'Athènes', '2026-07-02T10:00:00', 'flight', 'À réserver',
        '', '', 'ATH', 'Athènes', 'CDG', 'Paris', '2026-07-03T10:00:00', 'flight', 'Retour',
      ],
    );

    await db.runAsync(
      `INSERT INTO reservations (kind, title, location, starts_at, ends_at, notes) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?)`,
      [
        'ferry', 'Ferry Crète → Santorin', "Port d'Héraklion", '2026-06-30T09:00:00', '2026-06-30T13:00:00', 'À réserver (SeaJets / Blue Star)',
        'car', 'Voiture de location en Crète', "Aéroport d'Héraklion (HER)", '2026-06-25T12:00:00', '2026-06-30T09:00:00', '5 jours, prise et retour à Héraklion',
      ],
    );

    await db.runAsync(
      `INSERT INTO tasks (title, section, due_date) VALUES
        (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)`,
      [
        'Confirmer Mövenpick Gammarth (16/06)', 'mariage', '2026-05-20',
        'Réserver hôtel Monastir (3 nuits)', 'mariage', '2026-05-20',
        'Réserver hôtel Hammamet (1 nuit)', 'mariage', '2026-05-25',
        'Réserver vol Tunis → Paris (23/06)', 'voyage', '2026-05-25',
        'Réserver hôtel Paris (2 nuits)', 'voyage', '2026-05-25',
        'Réserver vol Paris → Héraklion (25/06)', 'voyage', '2026-05-30',
        'Réserver voiture de location Crète (5 j)', 'voyage', '2026-05-30',
        'Réserver ferry Crète → Santorin (30/06)', 'voyage', '2026-06-05',
      ],
    );

    const budgetCats: [string, string, string, number][] = [
      ['mariage', 'Lieu de réception', '🏛️', 0],
      ['mariage', 'Traiteur', '🍽️', 0],
      ['mariage', 'Tenues', '👗', 0],
      ['mariage', 'Photographe / vidéo', '📸', 0],
      ['mariage', 'Fleurs & déco', '💐', 0],
      ['mariage', 'Musique / DJ', '🎵', 0],
      ['mariage', 'Alliances', '💍', 0],
      ['mariage', 'Transport invités', '🚐', 0],
      ['mariage', 'Maquillage / coiffure', '💄', 0],
      ['mariage', 'Autre', '➕', 0],
      ['voyage', 'Vols', '✈️', 0],
      ['voyage', 'Hôtels', '🏨', 0],
      ['voyage', 'Restaurants', '🍴', 0],
      ['voyage', 'Activités', '🎟️', 0],
      ['voyage', 'Transport sur place', '🚗', 0],
      ['voyage', 'Shopping & souvenirs', '🛍️', 0],
      ['voyage', 'Autre', '➕', 0],
    ];
    for (let i = 0; i < budgetCats.length; i++) {
      const [section, name, emoji, planned] = budgetCats[i];
      await db.runAsync(
        `INSERT INTO budget_categories (section, name, emoji, planned_cents, position) VALUES (?,?,?,?,?)`,
        [section, name, emoji, planned, i],
      );
    }

    const packing: [string, string][] = [
      ['Documents', 'Passeport (les 2)'],
      ['Documents', "Carte d'identité"],
      ['Documents', 'Permis de conduire (Crète)'],
      ['Documents', 'Carte bancaire + carte de secours'],
      ['Documents', 'Carte européenne d\'assurance maladie'],
      ['Documents', 'Billets / confirmations imprimés'],
      ['Vêtements plage', 'Maillots de bain'],
      ['Vêtements plage', 'Paréos / serviettes microfibre'],
      ['Vêtements plage', 'Tongs / sandales'],
      ['Vêtements plage', 'Chapeaux / casquettes'],
      ['Vêtements jour', 'T-shirts'],
      ['Vêtements jour', 'Shorts'],
      ['Vêtements jour', 'Robes légères'],
      ['Vêtements jour', 'Pantalons légers'],
      ['Vêtements soir', 'Tenues habillées (Santorin)'],
      ['Vêtements soir', 'Chaussures de ville'],
      ['Beauté', 'Crème solaire SPF 50'],
      ['Beauté', 'After-sun'],
      ['Beauté', 'Trousse de toilette'],
      ['Beauté', 'Brosse / peigne'],
      ['Beauté', 'Maquillage'],
      ['Beauté', 'Parfum'],
      ['Tech', 'Chargeurs téléphone'],
      ['Tech', 'Batterie externe'],
      ['Tech', 'Adaptateur prises (Grèce/Tunisie)'],
      ['Tech', 'Écouteurs'],
      ['Tech', 'Appareil photo + carte mémoire'],
      ['Santé', 'Trousse pharmacie (paracétamol, anti-diarrhéique, pansements)'],
      ['Santé', 'Médicaments personnels'],
      ['Santé', 'Anti-moustiques'],
      ['Mariage', 'Robe de mariée + accessoires'],
      ['Mariage', 'Costume du marié'],
      ['Mariage', 'Alliances'],
      ['Mariage', 'Chaussures de cérémonie'],
    ];
    for (let i = 0; i < packing.length; i++) {
      const [cat, label] = packing[i];
      await db.runAsync(
        `INSERT INTO packing (category, label, position) VALUES (?,?,?)`,
        [cat, label, i],
      );
    }

    const shots: [string, string][] = [
      ['Préparatifs', 'Robe accrochée'],
      ['Préparatifs', 'Maquillage / coiffure'],
      ['Préparatifs', 'Alliances en gros plan'],
      ['Préparatifs', 'Bouquet de la mariée'],
      ['Cérémonie', 'Arrivée des mariés'],
      ['Cérémonie', 'Échange des consentements'],
      ['Cérémonie', 'Premier baiser'],
      ['Cérémonie', 'Sortie sous les pétales'],
      ['Famille', 'Mariés + parents mariée'],
      ['Famille', 'Mariés + parents marié'],
      ['Famille', 'Mariés + grands-parents'],
      ['Famille', 'Mariés + frères/sœurs'],
      ['Couple', 'Coucher de soleil à Gammarth'],
      ['Couple', 'Premier regard'],
      ['Couple', 'Slow dance'],
      ['Réception', "Vue d'ensemble salle"],
      ['Réception', 'Discours'],
      ['Réception', 'Coupe du gâteau'],
      ['Réception', 'Première danse'],
      ['Réception', 'Piste de danse pleine'],
    ];
    for (let i = 0; i < shots.length; i++) {
      const [cat, label] = shots[i];
      await db.runAsync(
        `INSERT INTO shot_list (category, label, position) VALUES (?,?,?)`,
        [cat, label, i],
      );
    }

    const moments = ['Cérémonie', 'Cocktail', 'Dîner', 'Première danse', 'Soirée', 'Ne pas jouer'];
    for (let i = 0; i < moments.length; i++) {
      await db.runAsync(
        `INSERT INTO playlist (moment, title, artist, position, do_not_play) VALUES (?,?,?,?,?)`,
        [moments[i], '— à compléter —', '', i, moments[i] === 'Ne pas jouer' ? 1 : 0],
      );
    }

    const vowsRows: [string, string, string][] = [
      ['vows', 'Mes vœux', ''],
      ['vows', 'Vœux de mon/ma partenaire', ''],
      ['speech', 'Discours du marié', ''],
      ['speech', 'Discours de la mariée', ''],
      ['speech', 'Discours témoins', ''],
    ];
    const now = new Date().toISOString();
    for (const [kind, title, content] of vowsRows) {
      await db.runAsync(
        `INSERT INTO vows (kind, title, content, updated_at) VALUES (?,?,?,?)`,
        [kind, title, content, now],
      );
    }

    const docs: [string, string, string | null][] = [
      ['passport', 'Passeport — toi', null],
      ['passport', 'Passeport — partenaire', null],
      ['id', "Carte d'identité — toi", null],
      ['id', "Carte d'identité — partenaire", null],
      ['insurance', 'Assurance voyage', null],
      ['insurance', "Carte européenne d'assurance maladie", null],
      ['driving', 'Permis de conduire (Crète)', null],
    ];
    for (const [kind, name, expiry] of docs) {
      await db.runAsync(
        `INSERT INTO documents (kind, name, expiry_date) VALUES (?,?,?)`,
        [kind, name, expiry],
      );
    }

    const dayOf: [string, string, string][] = [
      ['09:00', 'Réveil + petit-déjeuner', 'Mariés'],
      ['10:00', 'Coiffure & maquillage mariée', 'Mariée + témoins'],
      ['12:00', 'Déjeuner léger', 'Mariés'],
      ['14:00', 'Habillage', 'Mariés séparément'],
      ['15:30', 'Photos de préparatifs', 'Photographe'],
      ['16:30', 'Arrivée sur le lieu', 'Tous'],
      ['17:00', 'Cérémonie', 'Tous'],
      ['18:00', 'Vin d\'honneur / cocktail', 'Tous'],
      ['19:30', 'Photos de couple', 'Mariés + photographe'],
      ['20:30', 'Dîner', 'Tous'],
      ['22:00', 'Première danse', 'Mariés'],
      ['22:30', 'Soirée dansante', 'Tous'],
      ['00:00', 'Pièce montée', 'Tous'],
    ];
    for (let i = 0; i < dayOf.length; i++) {
      const [time, title, who] = dayOf[i];
      await db.runAsync(
        `INSERT INTO day_of (time, title, who, position) VALUES (?,?,?,?)`,
        [time, title, who, i],
      );
    }

    const tables: [string, number][] = [
      ['Table d\'honneur', 10],
      ['Famille mariée', 8],
      ['Famille marié', 8],
      ['Amis', 10],
      ['Collègues', 8],
    ];
    for (const [name, cap] of tables) {
      await db.runAsync(`INSERT INTO tables_plan (name, capacity) VALUES (?,?)`, [name, cap]);
    }

    const vendors: [string, string][] = [
      ['Lieu', 'Mövenpick Gammarth'],
      ['Traiteur', 'À choisir'],
      ['Photographe', 'À choisir'],
      ['Vidéaste', 'À choisir'],
      ['DJ / musique', 'À choisir'],
      ['Fleuriste', 'À choisir'],
      ['Robe de mariée', 'À choisir'],
      ['Costume', 'À choisir'],
      ['Coiffeur / maquilleur', 'À choisir'],
      ['Alliances', 'À choisir'],
    ];
    for (const [cat, name] of vendors) {
      await db.runAsync(`INSERT INTO vendors (category, name) VALUES (?,?)`, [cat, name]);
    }

    type Day = { date: string; loc: string };
    const itinerary: Day[] = [
      { date: '2026-06-16', loc: 'Tunis — Mariage' },
      { date: '2026-06-17', loc: 'Route vers Monastir' },
      { date: '2026-06-18', loc: 'Monastir' },
      { date: '2026-06-19', loc: 'Monastir' },
      { date: '2026-06-20', loc: 'Tunis — chez les parents' },
      { date: '2026-06-21', loc: 'Tunis — chez les parents' },
      { date: '2026-06-22', loc: 'Hammamet' },
      { date: '2026-06-23', loc: 'Vol Tunis → Paris' },
      { date: '2026-06-24', loc: 'Paris' },
      { date: '2026-06-25', loc: 'Vol Paris → Héraklion — récupération voiture' },
      { date: '2026-06-26', loc: 'Crète — Héraklion / Knossos' },
      { date: '2026-06-27', loc: 'Crète — plages sud' },
      { date: '2026-06-28', loc: 'Crète — Chania' },
      { date: '2026-06-29', loc: 'Crète — détente' },
      { date: '2026-06-30', loc: 'Ferry vers Santorin' },
      { date: '2026-07-01', loc: 'Santorin — Oia coucher de soleil' },
      { date: '2026-07-02', loc: 'Vol Santorin → Athènes' },
      { date: '2026-07-03', loc: 'Vol Athènes → Paris (retour)' },
    ];
    for (const d of itinerary) {
      await db.runAsync(
        `INSERT INTO activities (section, date, time, title, location, position) VALUES (?,?,?,?,?,?)`,
        ['voyage', d.date, '', '— ajouter des activités —', d.loc, 0],
      );
    }

    await db.runAsync(`INSERT INTO meta (key, value) VALUES ('seeded_v2', '1')`);
    await db.execAsync('COMMIT');
  } catch (e) {
    await db.execAsync('ROLLBACK');
    throw e;
  }
}
