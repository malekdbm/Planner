import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Hotel } from '@/db';
import { daysUntil, formatDateLong, WEDDING_DATE } from '@/utils/date';

const SECTIONS: { href: string; label: string; emoji: string; desc: string }[] = [
  { href: '/checklist', label: 'Checklist', emoji: '✅', desc: 'Tâches & échéances' },
  { href: '/budget?section=mariage', label: 'Budget', emoji: '💶', desc: 'Catégories & dépenses' },
  { href: '/invites', label: 'Invités', emoji: '👥', desc: 'RSVP & contacts' },
  { href: '/plan-table', label: 'Plan de table', emoji: '🪑', desc: 'Tables & placement' },
  { href: '/vendeurs', label: 'Prestataires', emoji: '🤝', desc: 'Contrats & paiements' },
  { href: '/playlist', label: 'Playlist', emoji: '🎵', desc: 'Cérémonie · soirée' },
  { href: '/photos', label: 'Photos', emoji: '📸', desc: 'Liste de plans' },
  { href: '/voeux', label: 'Vœux & discours', emoji: '💌', desc: 'Brouillons privés' },
  { href: '/jour-j', label: 'Jour J', emoji: '⏱️', desc: 'Planning minute par minute' },
  { href: '/cadeaux', label: 'Cadeaux', emoji: '🎁', desc: 'Liste & cagnotte' },
];

export default function Mariage() {
  const router = useRouter();
  const [venue, setVenue] = useState<Hotel | null>(null);
  const [stats, setStats] = useState({ tasks: 0, tasksDone: 0, guests: 0, rsvpYes: 0 });

  const load = useCallback(async () => {
    const db = await getDb();
    setVenue(await db.getFirstAsync<Hotel>(`SELECT * FROM hotels WHERE checkin = '${WEDDING_DATE}' LIMIT 1`));
    const t = await db.getFirstAsync<{ total: number; done: number }>(
      `SELECT COUNT(*) as total, SUM(done) as done FROM tasks WHERE section = 'mariage'`,
    );
    const g = await db.getFirstAsync<{ total: number; yes: number }>(
      `SELECT COUNT(*) as total, SUM(CASE WHEN rsvp = 'yes' THEN 1 ELSE 0 END) as yes FROM guests`,
    );
    setStats({
      tasks: t?.total ?? 0, tasksDone: t?.done ?? 0,
      guests: g?.total ?? 0, rsvpYes: g?.yes ?? 0,
    });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const d = daysUntil(WEDDING_DATE);

  return (
    <Screen title="Mariage" subtitle="Tunis · 16 juin 2026">
      <View style={styles.hero}>
        <Text style={styles.heroDate}>{formatDateLong(WEDDING_DATE)}</Text>
        <Text style={styles.heroDays}>{d} jours</Text>
        {venue && <Text style={styles.heroVenue}>Nuit du mariage · {venue.name}, {venue.city}</Text>}
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.tasksDone}/{stats.tasks}</Text>
          <Text style={styles.statLabel}>Tâches</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.rsvpYes}/{stats.guests}</Text>
          <Text style={styles.statLabel}>RSVP oui</Text>
        </Card>
      </View>

      <View style={styles.grid}>
        {SECTIONS.map((s) => (
          <Pressable key={s.href} style={styles.tile} onPress={() => router.push(s.href as any)}>
            <Text style={styles.tileEmoji}>{s.emoji}</Text>
            <Text style={styles.tileLabel}>{s.label}</Text>
            <Text style={styles.tileDesc}>{s.desc}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.wedding, borderRadius: radius.lg,
    padding: spacing.xl, marginBottom: spacing.lg,
  },
  heroDate: { color: '#FFF', fontSize: fontSize.md, opacity: 0.95, textTransform: 'capitalize' },
  heroDays: { color: '#FFF', fontSize: 48, fontWeight: '800', marginVertical: spacing.xs },
  heroVenue: { color: '#FFF', opacity: 0.95, fontSize: fontSize.sm },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, marginBottom: 0, alignItems: 'center' },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  tile: {
    width: '48%', backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  tileEmoji: { fontSize: 28, marginBottom: spacing.xs },
  tileLabel: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  tileDesc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
