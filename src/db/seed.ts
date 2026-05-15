import type { SQLiteDatabase } from 'expo-sqlite';

export async function seedIfEmpty(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM meta WHERE key = 'seeded'`,
  );
  if (row?.value === '1') return;

  await db.execAsync('BEGIN');
  try {
    await db.runAsync(
      `INSERT INTO hotels (name, city, country, checkin, checkout, nights, kind, notes) VALUES
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?)`,
      [
        'Mövenpick Gammarth', 'Gammarth, Tunis', 'Tunisie', '2026-06-16', '2026-06-17', 1, 'hotel', 'Nuit du mariage',
        'Hôtel à Monastir', 'Monastir', 'Tunisie', '2026-06-17', '2026-06-20', 3, 'hotel', 'À préciser',
        'Chez mes parents', 'Tunis', 'Tunisie', '2026-06-20', '2026-06-22', 2, 'family', 'Famille',
        'Hôtel à Hammamet', 'Hammamet', 'Tunisie', '2026-06-22', '2026-06-23', 1, 'hotel', 'À préciser',
      ],
    );

    await db.runAsync(
      `INSERT INTO hotels (name, city, country, checkin, checkout, nights, kind, notes) VALUES
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?)`,
      [
        'Hôtel à Paris', 'Paris', 'France', '2026-06-23', '2026-06-25', 2, 'hotel', 'À préciser',
        'Hôtel à Héraklion / Crète', 'Héraklion', 'Grèce', '2026-06-25', '2026-06-30', 5, 'hotel', 'Voiture de location 5 jours',
        'Hôtel à Santorin', 'Santorin', 'Grèce', '2026-06-30', '2026-07-02', 2, 'hotel', 'Arrivée en ferry depuis la Crète',
        'Hôtel à Athènes', 'Athènes', 'Grèce', '2026-07-02', '2026-07-03', 1, 'hotel', 'À préciser',
      ],
    );

    await db.runAsync(
      `INSERT INTO flights (airline, flight_no, from_code, from_city, to_code, to_city, depart_at, kind, notes) VALUES
        (?,?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?,?),
        (?,?,?,?,?,?,?,?,?)`,
      [
        '', '', 'TUN', 'Tunis', 'CDG', 'Paris', '2026-06-23T10:00:00', 'flight', 'À réserver',
        '', '', 'CDG', 'Paris', 'HER', 'Héraklion', '2026-06-25T10:00:00', 'flight', 'À réserver',
        '', '', 'JTR', 'Santorin', 'ATH', 'Athènes', '2026-07-02T10:00:00', 'flight', 'À réserver',
        '', '', 'ATH', 'Athènes', 'CDG', 'Paris', '2026-07-03T10:00:00', 'flight', 'Retour',
      ],
    );

    await db.runAsync(
      `INSERT INTO reservations (kind, title, location, starts_at, ends_at, notes) VALUES
        (?,?,?,?,?,?),
        (?,?,?,?,?,?)`,
      [
        'ferry', 'Ferry Crète → Santorin', 'Port d\'Héraklion', '2026-06-30T09:00:00', '2026-06-30T13:00:00', 'À réserver (SeaJets / Blue Star)',
        'car', 'Voiture de location en Crète', 'Aéroport d\'Héraklion (HER)', '2026-06-25T12:00:00', '2026-06-30T09:00:00', '5 jours, prise et retour à Héraklion',
      ],
    );

    await db.runAsync(
      `INSERT INTO tasks (title, section, due_date) VALUES
        (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)`,
      [
        'Confirmer Mövenpick Gammarth (16/06)', 'mariage', '2026-05-20',
        'Réserver hôtel Monastir (3 nuits)', 'mariage', '2026-05-20',
        'Réserver hôtel Hammamet (1 nuit)', 'mariage', '2026-05-25',
        'Réserver vol Tunis → Paris (23/06)', 'lune-de-miel', '2026-05-25',
        'Réserver hôtel Paris (2 nuits)', 'lune-de-miel', '2026-05-25',
        'Réserver vol Paris → Héraklion (25/06)', 'lune-de-miel', '2026-05-30',
        'Réserver voiture de location Crète (5 j)', 'lune-de-miel', '2026-05-30',
        'Réserver ferry Crète → Santorin (30/06)', 'lune-de-miel', '2026-06-05',
      ],
    );

    await db.runAsync(
      `INSERT INTO meta (key, value) VALUES ('seeded', '1')`,
    );
    await db.execAsync('COMMIT');
  } catch (e) {
    await db.execAsync('ROLLBACK');
    throw e;
  }
}
