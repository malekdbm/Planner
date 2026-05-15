export const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  checkin TEXT NOT NULL,
  checkout TEXT NOT NULL,
  nights INTEGER NOT NULL,
  confirmation TEXT,
  room_type TEXT,
  cost_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  paid INTEGER DEFAULT 0,
  notes TEXT,
  phone TEXT,
  address TEXT,
  kind TEXT DEFAULT 'hotel'
);

CREATE TABLE IF NOT EXISTS flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline TEXT,
  flight_no TEXT,
  from_code TEXT,
  from_city TEXT,
  to_code TEXT,
  to_city TEXT,
  depart_at TEXT NOT NULL,
  arrive_at TEXT,
  pnr TEXT,
  seat TEXT,
  cabin TEXT,
  baggage TEXT,
  cost_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  paid INTEGER DEFAULT 0,
  notes TEXT,
  kind TEXT DEFAULT 'flight'
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  confirmation TEXT,
  cost_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  paid INTEGER DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  due_date TEXT,
  done INTEGER DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  category TEXT NOT NULL,
  vendor TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  date TEXT NOT NULL,
  notes TEXT
);
`;
