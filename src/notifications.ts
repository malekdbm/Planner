import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDb } from './db';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return final === 'granted';
}

async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function atTime(iso: string, hour = 9, minute = 0): Date | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function schedule(title: string, body: string, at: Date) {
  if (at.getTime() < Date.now() + 60_000) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: at,
    },
  });
}

export async function rescheduleAllReminders() {
  const granted = await requestPermissions();
  if (!granted) return;
  await cancelAll();
  const db = await getDb();

  const tasks = await db.getAllAsync<{ id: number; title: string; due_date: string | null; done: number }>(
    `SELECT id, title, due_date, done FROM tasks WHERE due_date IS NOT NULL AND done = 0`,
  );
  for (const t of tasks) {
    const due = atTime(t.due_date!, 9, 0);
    if (!due) continue;
    await schedule('Tâche à faire', t.title, due);
    const day_before = new Date(due);
    day_before.setDate(day_before.getDate() - 1);
    await schedule('Demain : tâche', t.title, day_before);
  }

  const flights = await db.getAllAsync<{ id: number; from_city: string | null; to_city: string | null; depart_at: string }>(
    `SELECT id, from_city, to_city, depart_at FROM flights`,
  );
  for (const f of flights) {
    const dep = new Date(f.depart_at);
    if (isNaN(dep.getTime())) continue;
    const checkIn = new Date(dep.getTime() - 24 * 60 * 60 * 1000);
    await schedule(`Check-in ouvert`, `${f.from_city} → ${f.to_city} dans 24h`, checkIn);
    const threeH = new Date(dep.getTime() - 3 * 60 * 60 * 1000);
    await schedule(`Vol dans 3h`, `${f.from_city} → ${f.to_city}`, threeH);
  }

  const hotels = await db.getAllAsync<{ id: number; name: string; checkin: string }>(
    `SELECT id, name, checkin FROM hotels`,
  );
  for (const h of hotels) {
    const inDate = atTime(h.checkin, 9, 0);
    if (!inDate) continue;
    const eve = new Date(inDate);
    eve.setDate(eve.getDate() - 1);
    await schedule(`Demain : arrivée à ${h.name}`, 'Prépare ton check-in', eve);
  }

  const reservations = await db.getAllAsync<{ id: number; title: string; starts_at: string }>(
    `SELECT id, title, starts_at FROM reservations`,
  );
  for (const r of reservations) {
    const at = new Date(r.starts_at);
    if (isNaN(at.getTime())) continue;
    const twoH = new Date(at.getTime() - 2 * 60 * 60 * 1000);
    await schedule(`Bientôt : ${r.title}`, 'Dans 2 heures', twoH);
  }
}

export async function setReminderEnabled(enabled: boolean) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES ('reminders', ?)`,
    [enabled ? '1' : '0'],
  );
  if (enabled) await rescheduleAllReminders();
  else await cancelAll();
}

export async function getReminderEnabled(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM settings WHERE key = 'reminders'`,
  );
  return row?.value === '1';
}
