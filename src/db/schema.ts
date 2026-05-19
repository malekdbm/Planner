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
  notes TEXT,
  receipt_uri TEXT
);

CREATE TABLE IF NOT EXISTS budget_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  planned_cents INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  side TEXT DEFAULT 'both',
  group_name TEXT,
  phone TEXT,
  email TEXT,
  rsvp TEXT DEFAULT 'pending',
  plus_one INTEGER DEFAULT 0,
  dietary TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT DEFAULT 'voyage',
  date TEXT NOT NULL,
  time TEXT,
  title TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  cost_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  position INTEGER DEFAULT 0,
  done INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  contract_cents INTEGER DEFAULT 0,
  deposit_cents INTEGER DEFAULT 0,
  balance_cents INTEGER DEFAULT 0,
  due_date TEXT,
  next_meeting TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS packing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  checked INTEGER DEFAULT 0,
  needs_buy INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  number TEXT,
  expiry_date TEXT,
  notes TEXT,
  attachment_uri TEXT
);

CREATE TABLE IF NOT EXISTS journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  location TEXT,
  content TEXT,
  mood TEXT,
  photo_uri TEXT
);

CREATE TABLE IF NOT EXISTS shot_list (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS playlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  moment TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  duration_sec INTEGER DEFAULT 0,
  link TEXT,
  do_not_play INTEGER DEFAULT 0,
  position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS day_of (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  who TEXT,
  location TEXT,
  notes TEXT,
  position INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  store TEXT,
  link TEXT,
  price_cents INTEGER DEFAULT 0,
  claimed_by TEXT,
  received INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tables_plan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 8
);

CREATE TABLE IF NOT EXISTS table_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id INTEGER NOT NULL,
  guest_id INTEGER NOT NULL,
  UNIQUE(guest_id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;
