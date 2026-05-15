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
  id: number;
  name: string;
  city: string | null;
  country: string | null;
  checkin: string;
  checkout: string;
  nights: number;
  confirmation: string | null;
  room_type: string | null;
  cost_cents: number;
  currency: string;
  paid: number;
  notes: string | null;
  phone: string | null;
  address: string | null;
  kind: string;
};

export type Flight = {
  id: number;
  airline: string | null;
  flight_no: string | null;
  from_code: string | null;
  from_city: string | null;
  to_code: string | null;
  to_city: string | null;
  depart_at: string;
  arrive_at: string | null;
  pnr: string | null;
  seat: string | null;
  cabin: string | null;
  baggage: string | null;
  cost_cents: number;
  currency: string;
  paid: number;
  notes: string | null;
  kind: string;
};

export type Reservation = {
  id: number;
  kind: string;
  title: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  confirmation: string | null;
  cost_cents: number;
  currency: string;
  paid: number;
  notes: string | null;
};

export type Task = {
  id: number;
  title: string;
  section: string;
  due_date: string | null;
  done: number;
  notes: string | null;
};
