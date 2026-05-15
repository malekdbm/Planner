import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb } from '@/db';
import { formatDateLong, formatTime } from '@/utils/date';

type Item = {
  date: string;
  time?: string;
  title: string;
  subtitle?: string;
  color: string;
  emoji: string;
};

export default function Calendrier() {
  const [items, setItems] = useState<Item[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();

    const hotels = await db.getAllAsync<any>(
      `SELECT name, city, country, checkin, checkout, nights FROM hotels ORDER BY checkin`,
    );
    const flights = await db.getAllAsync<any>(
      `SELECT from_city, to_city, depart_at, airline, flight_no FROM flights ORDER BY depart_at`,
    );
    const reservations = await db.getAllAsync<any>(
      `SELECT kind, title, location, starts_at FROM reservations ORDER BY starts_at`,
    );
    const tasks = await db.getAllAsync<any>(
      `SELECT title, section, due_date FROM tasks WHERE due_date IS NOT NULL ORDER BY due_date`,
    );

    const all: Item[] = [];
    for (const h of hotels) {
      all.push({
        date: h.checkin,
        title: `Arrivée ${h.name}`,
        subtitle: `${h.city ?? ''} · ${h.nights} nuit${h.nights > 1 ? 's' : ''}`,
        color: colors.hotel,
        emoji: '🏨',
      });
      all.push({
        date: h.checkout,
        title: `Départ ${h.name}`,
        subtitle: h.city ?? undefined,
        color: colors.hotel,
        emoji: '🛏️',
      });
    }
    for (const f of flights) {
      all.push({
        date: f.depart_at.slice(0, 10),
        time: formatTime(f.depart_at),
        title: `Vol ${f.from_city} → ${f.to_city}`,
        subtitle: [f.airline, f.flight_no].filter(Boolean).join(' ') || 'À réserver',
        color: colors.flight,
        emoji: '✈️',
      });
    }
    for (const r of reservations) {
      all.push({
        date: r.starts_at.slice(0, 10),
        time: formatTime(r.starts_at),
        title: r.title,
        subtitle: r.location ?? undefined,
        color: colors.reservation,
        emoji: r.kind === 'ferry' ? '⛴️' : r.kind === 'car' ? '🚗' : '📌',
      });
    }
    for (const t of tasks) {
      all.push({
        date: t.due_date,
        title: t.title,
        subtitle: 'Échéance',
        color: t.section === 'mariage' ? colors.wedding : colors.honeymoon,
        emoji: t.section === 'mariage' ? '💍' : '✈️',
      });
    }

    all.sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')));
    setItems(all);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const byDate = items.reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.date] ||= []).push(it);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort();

  return (
    <Screen title="Calendrier" subtitle="Mariage · Voyage · Réservations">
      {dates.length === 0 && (
        <Card><Text style={{ color: colors.textMuted }}>Aucun évènement.</Text></Card>
      )}
      {dates.map((d) => (
        <View key={d} style={styles.day}>
          <Text style={styles.dayHeader}>{formatDateLong(d)}</Text>
          {byDate[d].map((it, idx) => (
            <View key={idx} style={styles.item}>
              <View style={[styles.dot, { backgroundColor: it.color }]} />
              <Text style={styles.emoji}>{it.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>
                  {it.time ? <Text style={styles.time}>{it.time}  </Text> : null}
                  {it.title}
                </Text>
                {it.subtitle ? <Text style={styles.itemSubtitle}>{it.subtitle}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    marginBottom: spacing.lg,
  },
  dayHeader: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primaryDark,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  itemTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  time: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
