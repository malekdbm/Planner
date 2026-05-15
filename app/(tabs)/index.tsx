import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Task, type Hotel, type Flight } from '@/db';
import { daysUntil, formatDateLong, formatDateShort, WEDDING_DATE } from '@/utils/date';

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextHotel, setNextHotel] = useState<Hotel | null>(null);
  const [nextFlight, setNextFlight] = useState<Flight | null>(null);

  const load = useCallback(async () => {
    const db = await getDb();
    const t = await db.getAllAsync<Task>(
      `SELECT * FROM tasks WHERE done = 0 ORDER BY due_date ASC LIMIT 3`,
    );
    const h = await db.getFirstAsync<Hotel>(
      `SELECT * FROM hotels WHERE checkin >= date('now') ORDER BY checkin ASC LIMIT 1`,
    );
    const f = await db.getFirstAsync<Flight>(
      `SELECT * FROM flights WHERE depart_at >= datetime('now') ORDER BY depart_at ASC LIMIT 1`,
    );
    setTasks(t);
    setNextHotel(h ?? null);
    setNextFlight(f ?? null);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const dWedding = daysUntil(WEDDING_DATE);

  return (
    <Screen title="Mariage & Lune de miel" subtitle="Tunisie · Paris · Grèce">
      <View style={styles.countdown}>
        <Text style={styles.countdownLabel}>Jours avant le mariage</Text>
        <Text style={styles.countdownValue}>{dWedding}</Text>
        <Text style={styles.countdownDate}>{formatDateLong(WEDDING_DATE)}</Text>
      </View>

      {nextFlight && (
        <Pressable onPress={() => router.push('/voyage')}>
          <Card
            title={`✈️  ${nextFlight.from_city} → ${nextFlight.to_city}`}
            subtitle={formatDateShort(nextFlight.depart_at)}
            badge="Prochain vol"
            badgeColor={colors.flight}
          />
        </Pressable>
      )}

      {nextHotel && (
        <Pressable onPress={() => router.push('/voyage')}>
          <Card
            title={`🏨  ${nextHotel.name}`}
            subtitle={`${formatDateShort(nextHotel.checkin)} → ${formatDateShort(nextHotel.checkout)} · ${nextHotel.nights} nuit${nextHotel.nights > 1 ? 's' : ''}`}
            badge="Prochain séjour"
            badgeColor={colors.hotel}
          />
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>À faire</Text>
      {tasks.length === 0 ? (
        <Card>
          <Text style={{ color: colors.textMuted }}>Aucune tâche en attente 🎉</Text>
        </Card>
      ) : (
        tasks.map((t) => (
          <Card key={t.id} title={t.title} subtitle={t.due_date ? `Échéance : ${formatDateShort(t.due_date)}` : undefined} badge={t.section === 'mariage' ? 'Mariage' : 'Voyage'} badgeColor={t.section === 'mariage' ? colors.wedding : colors.honeymoon} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  countdown: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  countdownLabel: {
    color: '#FFF',
    fontSize: fontSize.sm,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countdownValue: {
    color: '#FFF',
    fontSize: 72,
    fontWeight: '800',
    marginVertical: spacing.xs,
  },
  countdownDate: {
    color: '#FFF',
    fontSize: fontSize.md,
    opacity: 0.95,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
