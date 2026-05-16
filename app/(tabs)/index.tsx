import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Task, type Hotel, type Flight, type Activity } from '@/db';
import { daysUntil, formatDateLong, formatDateShort, formatTime, WEDDING_DATE, TRIP_END_DATE, formatEUR } from '@/utils/date';

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextHotel, setNextHotel] = useState<Hotel | null>(null);
  const [nextFlight, setNextFlight] = useState<Flight | null>(null);
  const [todayActs, setTodayActs] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ budget: 0, spent: 0, guests: 0, rsvpYes: 0 });

  const load = useCallback(async () => {
    const db = await getDb();
    const t = await db.getAllAsync<Task>(`SELECT * FROM tasks WHERE done = 0 ORDER BY due_date ASC LIMIT 3`);
    const h = await db.getFirstAsync<Hotel>(`SELECT * FROM hotels WHERE checkout >= date('now') ORDER BY checkin ASC LIMIT 1`);
    const f = await db.getFirstAsync<Flight>(`SELECT * FROM flights WHERE depart_at >= datetime('now') ORDER BY depart_at ASC LIMIT 1`);
    const today = new Date().toISOString().slice(0, 10);
    const acts = await db.getAllAsync<Activity>(`SELECT * FROM activities WHERE date = ? ORDER BY time`, [today]);
    const b = await db.getFirstAsync<{ p: number }>(`SELECT IFNULL(SUM(planned_cents),0) p FROM budget_categories`);
    const s = await db.getFirstAsync<{ s: number }>(`SELECT IFNULL(SUM(amount_cents),0) s FROM expenses`);
    const g = await db.getFirstAsync<{ total: number; yes: number }>(
      `SELECT COUNT(*) as total, SUM(CASE WHEN rsvp = 'yes' THEN 1 ELSE 0 END) as yes FROM guests`,
    );
    setTasks(t); setNextHotel(h ?? null); setNextFlight(f ?? null); setTodayActs(acts);
    setStats({ budget: b?.p ?? 0, spent: s?.s ?? 0, guests: g?.total ?? 0, rsvpYes: g?.yes ?? 0 });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const dWedding = daysUntil(WEDDING_DATE);
  const dTrip = daysUntil('2026-06-23');
  const dEnd = daysUntil(TRIP_END_DATE);

  return (
    <Screen title="Mariage & Lune de miel" subtitle="Tunisie · Paris · Grèce">
      <Pressable onPress={() => router.push('/recherche')} style={styles.search}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchText}>Rechercher invité, vol, tâche...</Text>
      </Pressable>

      <View style={styles.countdown}>
        <Text style={styles.countdownLabel}>Jours avant le mariage</Text>
        <Text style={styles.countdownValue}>{dWedding > 0 ? dWedding : dWedding === 0 ? '🎉' : '✓'}</Text>
        <Text style={styles.countdownDate}>{formatDateLong(WEDDING_DATE)}</Text>
      </View>

      <View style={styles.miniRow}>
        <View style={[styles.mini, { backgroundColor: colors.honeymoon }]}>
          <Text style={styles.miniLabel}>Départ voyage</Text>
          <Text style={styles.miniValue}>{dTrip > 0 ? `J-${dTrip}` : dEnd > 0 ? 'En cours' : 'Terminé'}</Text>
        </View>
        <View style={[styles.mini, { backgroundColor: colors.primary }]}>
          <Text style={styles.miniLabel}>RSVP oui</Text>
          <Text style={styles.miniValue}>{stats.rsvpYes}/{stats.guests}</Text>
        </View>
      </View>

      {todayActs.length > 0 && (
        <>
          <Text style={styles.section}>Aujourd'hui</Text>
          {todayActs.map((a) => (
            <Pressable key={a.id} onPress={() => router.push(`/itineraire/${a.id}`)}>
              <Card
                title={`${a.time ? a.time + '  ' : ''}${a.title}`}
                subtitle={a.location ?? undefined}
                badge="Auj."
                badgeColor={colors.honeymoon}
              />
            </Pressable>
          ))}
        </>
      )}

      {nextFlight && (
        <Pressable onPress={() => router.push(`/vols/${nextFlight.id}`)}>
          <Card
            title={`✈️  ${nextFlight.from_city} → ${nextFlight.to_city}`}
            subtitle={`${formatDateShort(nextFlight.depart_at)} · ${formatTime(nextFlight.depart_at)}`}
            badge="Prochain vol"
            badgeColor={colors.flight}
          />
        </Pressable>
      )}

      {nextHotel && (
        <Pressable onPress={() => router.push(`/hotels/${nextHotel.id}`)}>
          <Card
            title={`🏨  ${nextHotel.name}`}
            subtitle={`${formatDateShort(nextHotel.checkin)} → ${formatDateShort(nextHotel.checkout)} · ${nextHotel.nights} nuit${nextHotel.nights > 1 ? 's' : ''}`}
            badge="Prochain séjour"
            badgeColor={colors.hotel}
          />
        </Pressable>
      )}

      <Pressable onPress={() => router.push('/budget?section=mariage')}>
        <Card title="💶 Budget global" subtitle={`Dépensé ${formatEUR(stats.spent)} / ${formatEUR(stats.budget)}`} />
      </Pressable>

      <Text style={styles.section}>À faire ({tasks.length})</Text>
      {tasks.length === 0 ? (
        <Card><Text style={{ color: colors.textMuted }}>Aucune tâche en attente 🎉</Text></Card>
      ) : (
        tasks.map((t) => (
          <Pressable key={t.id} onPress={() => router.push(`/checklist/${t.id}`)}>
            <Card
              title={t.title}
              subtitle={t.due_date ? `Échéance : ${formatDateShort(t.due_date)}` : undefined}
              badge={t.section === 'mariage' ? '💍' : '✈️'}
              badgeColor={t.section === 'mariage' ? colors.wedding : colors.honeymoon}
            />
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    padding: spacing.md, borderRadius: radius.pill, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchText: { color: colors.textMuted, fontSize: fontSize.md },
  countdown: {
    backgroundColor: colors.primary, borderRadius: radius.lg,
    padding: spacing.xl, alignItems: 'center', marginBottom: spacing.md,
  },
  countdownLabel: { color: '#FFF', fontSize: fontSize.sm, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 },
  countdownValue: { color: '#FFF', fontSize: 72, fontWeight: '800', marginVertical: spacing.xs },
  countdownDate: { color: '#FFF', fontSize: fontSize.md, opacity: 0.95, textTransform: 'capitalize' },
  miniRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  mini: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  miniLabel: { color: '#FFF', fontSize: fontSize.xs, opacity: 0.9, letterSpacing: 0.5 },
  miniValue: { color: '#FFF', fontSize: fontSize.xl, fontWeight: '800', marginTop: 2 },
  section: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
});
