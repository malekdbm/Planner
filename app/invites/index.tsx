import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type Guest } from '@/db';

const RSVP_COLORS: Record<string, string> = {
  yes: colors.success,
  no: colors.danger,
  maybe: colors.payment,
  pending: colors.textMuted,
};
const RSVP_LABELS: Record<string, string> = {
  yes: '✓ Oui', no: '✗ Non', maybe: '? Peut-être', pending: '… En attente',
};

export default function Invites() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    const db = await getDb();
    const where = filter === 'all' ? '' : `WHERE rsvp = '${filter}'`;
    setGuests(await db.getAllAsync<Guest>(`SELECT * FROM guests ${where} ORDER BY name`));
  }, [filter]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const all = guests;
  const yes = all.filter((g) => g.rsvp === 'yes').length;
  const no = all.filter((g) => g.rsvp === 'no').length;
  const maybe = all.filter((g) => g.rsvp === 'maybe').length;
  const pending = all.filter((g) => g.rsvp === 'pending').length;
  const plusOnes = all.filter((g) => g.plus_one && g.rsvp === 'yes').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Invités" subtitle={`${all.length} invités · ${yes + plusOnes} confirmés`}>
        <View style={styles.statsRow}>
          <Stat label="Oui" value={yes + plusOnes} color={colors.success} />
          <Stat label="Non" value={no} color={colors.danger} />
          <Stat label="Peut-être" value={maybe} color={colors.payment} />
          <Stat label="Attente" value={pending} color={colors.textMuted} />
        </View>

        <View style={styles.chips}>
          {(['all', 'pending', 'yes', 'maybe', 'no'] as const).map((k) => (
            <Pressable key={k} onPress={() => setFilter(k)} style={[styles.chip, filter === k && styles.chipOn]}>
              <Text style={[styles.chipText, filter === k && styles.chipTextOn]}>
                {k === 'all' ? 'Tous' : RSVP_LABELS[k]}
              </Text>
            </Pressable>
          ))}
        </View>

        {guests.length === 0 && (
          <Card>
            <Text style={{ color: colors.textMuted }}>Aucun invité. Appuie sur + pour en ajouter.</Text>
          </Card>
        )}

        {guests.map((g) => (
          <Pressable key={g.id} onPress={() => router.push(`/invites/${g.id}`)}>
            <Card
              title={g.name}
              subtitle={`${g.side === 'mine' ? 'Mon côté' : g.side === 'partner' ? 'Côté partenaire' : 'Les deux'}${g.group_name ? ' · ' + g.group_name : ''}${g.plus_one ? ' · +1' : ''}`}
              badge={RSVP_LABELS[g.rsvp]}
              badgeColor={RSVP_COLORS[g.rsvp]}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/invites/new')} />
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: fontSize.xl, fontWeight: '800' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
});
