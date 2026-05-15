import * as SQLite from 'expo-sqlite';
import { SCHEMA } from './schema';
import { seedIfEmpty } from './seed';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('planner.db');
      await db.execAsync(SCHEMA);
      await seedIfEmpty(db);
      return db;
    })();
  }
  return dbPromise;
}

export type Hotel = {
  id: number; name: string; city: string | null; country: string | null;
  checkin: string; checkout: string; nights: number;
  confirmation: string | null; room_type: string | null;
  cost_cents: number; currency: string; paid: number;
  notes: string | null; phone: string | null; address: string | null; kind: string;
};

export type Flight = {
  id: number; airline: string | null; flight_no: string | null;
  from_code: string | null; from_city: string | null;
  to_code: string | null; to_city: string | null;
  depart_at: string; arrive_at: string | null;
  pnr: string | null; seat: string | null; cabin: string | null; baggage: string | null;
  cost_cents: number; currency: string; paid: number; notes: string | null; kind: string;
};

export type Reservation = {
  id: number; kind: string; title: string; location: string | null;
  starts_at: string; ends_at: string | null;
  confirmation: string | null; cost_cents: number; currency: string;
  paid: number; notes: string | null;
};

export type Task = {
  id: number; title: string; section: string;
  due_date: string | null; done: number; notes: string | null;
};

export type Expense = {
  id: number; section: string; category: string;
  vendor: string | null; amount_cents: number; currency: string;
  date: string; notes: string | null; receipt_uri: string | null;
};

export type BudgetCategory = {
  id: number; section: string; name: string; emoji: string | null;
  planned_cents: number; position: number;
};

export type Guest = {
  id: number; name: string; side: string; group_name: string | null;
  phone: string | null; email: string | null; rsvp: string;
  plus_one: number; dietary: string | null; notes: string | null;
};

export type Activity = {
  id: number; section: string; date: string; time: string | null;
  title: string; location: string | null; notes: string | null;
  cost_cents: number; currency: string; position: number; done: number;
};

export type Vendor = {
  id: number; category: string; name: string;
  phone: string | null; email: string | null;
  contract_cents: number; deposit_cents: number; balance_cents: number;
  due_date: string | null; next_meeting: string | null; notes: string | null;
};

export type Packing = {
  id: number; category: string; label: string;
  checked: number; needs_buy: number; position: number;
};

export type Document = {
  id: number; kind: string; name: string; number: string | null;
  expiry_date: string | null; notes: string | null; attachment_uri: string | null;
};

export type Journal = {
  id: number; date: string; location: string | null;
  content: string | null; mood: string | null; photo_uri: string | null;
};

export type ShotListItem = {
  id: number; category: string; label: string; done: number; position: number;
};

export type PlaylistItem = {
  id: number; moment: string; title: string; artist: string | null;
  duration_sec: number; link: string | null; do_not_play: number; position: number;
};

export type Vow = {
  id: number; kind: string; title: string; content: string | null; updated_at: string;
};

export type DayOfItem = {
  id: number; time: string; title: string;
  who: string | null; location: string | null; notes: string | null; position: number;
};

export type Gift = {
  id: number; name: string; store: string | null; link: string | null;
  price_cents: number; claimed_by: string | null; received: number;
};

export type TablePlan = {
  id: number; name: string; capacity: number;
};

export type TableAssignment = {
  id: number; table_id: number; guest_id: number;
};
