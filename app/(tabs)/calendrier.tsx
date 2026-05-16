import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
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
  href?: string;
};

const FILTERS = ['all', 'mariage', 'voyage', 'flight', 'hotel', 'reservation'] as const;
type Filter = typeof FILTERS[number];

export default function Calendrier() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    const db = await getDb();

    const hotels = await db.getAllAsync<any>(`SELECT id, name, city, checkin, checkout, nights FROM hotels ORDER BY checkin`);
    const flights = await db.getAllAsync<any>(`SELECT id, from_city, to_city, depart_at, airline, flight_no FROM flights ORDER BY depart_at`);
    const reservations = await db.getAllAsync<any>(`SELECT id, kind, title, location, starts_at FROM reservations ORDER BY starts_at`);
    const tasks = await db.getAllAsync<any>(`SELECT id, title, section, due_date FROM tasks WHERE due_date IS NOT NULL ORDER BY due_date`);
    const activities = await db.getAllAsync<any>(`SELECT id, date, time, title, location FROM activities WHERE title NOT LIKE '— ajouter%' ORDER BY date, time`);
    const dayOf = await db.getAllAsync<any>(`SELECT id, time, title, who FROM day_of ORDER BY time`);

    const all: Item[] = [];
    for (const h of hotels) {
      all.push({
        date: h.checkin, title: `Arrivée ${h.name}`, subtitle: `${h.city ?? ''} · ${h.nights} nuit${h.nights > 1 ? 's' : ''}`,
        color: colors.hotel, emoji: '🏨', href: `/hotels/${h.id}`,
      });
      all.push({
        date: h.checkout, title: `Départ ${h.name}`, subtitle: h.city ?? undefined,
        color: colors.hotel, emoji: '🛏️', href: `/hotels/${h.id}`,
      });
    }
    for (const f of flights) {
      all.push({
        date: f.depart_at.slice(0, 10), time: formatTime(f.depart_at),
        title: `Vol ${f.from_city} → ${f.to_city}`,
        subtitle: [f.airline, f.flight_no].filter(Boolean).join(' ') || 'À réserver',
        color: colors.flight, emoji: '✈️', href: `/vols/${f.id}`,
      });
    }
    for (const r of reservations) {
      all.push({
        date: r.starts_at.slice(0, 10), time: formatTime(r.starts_at),
        title: r.title, subtitle: r.location ?? undefined,
        color: colors.reservation, emoji: r.kind === 'ferry' ? '⛴️' : r.kind === 'car' ? '🚗' : '📌',
        href: `/reservations/${r.id}`,
      });
    }
    for (const t of tasks) {
      all.push({
        date: t.due_date, title: t.title, subtitle: 'Échéance',
        color: t.section === 'mariage' ? colors.wedding : colors.honeymoon,
        emoji: t.section === 'mariage' ? '💍' : '✈️',
        href: `/checklist/${t.id}`,
      });
    }
    for (const a of activities) {
      all.push({
        date: a.date, time: a.time || undefined, title: a.title, subtitle: a.location ?? undefined,
        color: colors.honeymoon, emoji: '🗺️', href: `/itineraire/${a.id}`,
      });
    }
    for (const item of dayOf) {
      all.push({
        date: '2026-06-16', time: item.time, title: `Jour J · ${item.title}`,
        subtitle: item.who ?? undefined, color: colors.wedding, emoji: '⏱️',
        href: `/jour-j/${item.id}`,
      });
    }

    all.sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')));
    setItems(all);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = items.filter((it) => {
    if (filter === 'all') return true;
    if (filter === 'mariage') return it.color === colors.wedding;
    if (filter === 'voyage') return it.color === colors.honeymoon;
    if (filter === 'flight') return it.color === colors.flight;
    if (filter === 'hotel') return it.color === colors.hotel;
    if (filter === 'reservation') return it.color === colors.reservation;
    return true;
  });

  const byDate = filtered.reduce<Record<string, Item[]>>((acc, it) => {
    (acc[it.date] ||= []).push(it);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort();

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <Screen title="Calendrier" subtitle={`${filtered.length} évènements`}>
      <View style={styles.filters}>
        {FILTERS.map((k) => (
          <Pressable key={k} onPress={() => setFilter(k)} style={[styles.chip, filter === k && styles.chipOn]}>
            <Text style={[styles.chipText, filter === k && styles.chipTextOn]}>
              {k === 'all' ? 'Tout' : k === 'mariage' ? '💍' : k === 'voyage' ? '🗺️' : k === 'flight' ? '✈️' : k === 'hotel' ? '🏨' : '📌'}
            </Text>
          </Pressable>
        ))}
      </View>

      {dates.length === 0 && <Card><Text style={{ color: colors.textMuted }}>Aucun évènement.</Text></Card>}

      {dates.map((d) => {
        const isToday = d === todayIso;
        return (
          <View key={d} style={styles.day}>
            <Text style={[styles.dayHeader, isToday && styles.dayToday]}>{formatDateLong(d)}{isToday ? ' · aujourd\'hui' : ''}</Text>
            {byDate[d].map((it, idx) => (
              <Pressable key={idx} onPress={() => it.href && router.push(it.href as any)}>
                <View style={styles.item}>
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
              </Pressable>
            ))}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
  day: { marginBottom: spacing.lg },
  dayHeader: { fontSize: fontSize.md, fontWeight: '700', color: colors.primaryDark, textTransform: 'capitalize', marginBottom: spacing.sm },
  dayToday: { color: colors.wedding },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  dot: { width: 4, alignSelf: 'stretch', borderRadius: 2, marginRight: spacing.md },
  emoji: { fontSize: 20, marginRight: spacing.sm },
  itemTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  itemSubtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  time: { color: colors.primaryDark, fontWeight: '700' },
});
