import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb } from '@/db';
import { daysUntil, TRIP_END_DATE } from '@/utils/date';

const SECTIONS: { href: string; label: string; emoji: string; desc: string }[] = [
  { href: '/vols', label: 'Vols & ferry', emoji: '✈️', desc: 'Tunis · Paris · Grèce' },
  { href: '/hotels', label: 'Hôtels', emoji: '🏨', desc: '17 nuits · 8 séjours' },
  { href: '/reservations', label: 'Réservations', emoji: '📌', desc: 'Voiture · ferry · tours' },
  { href: '/itineraire', label: 'Itinéraire', emoji: '🗺️', desc: 'Jour par jour' },
  { href: '/budget?section=voyage', label: 'Budget voyage', emoji: '💶', desc: 'Dépenses & catégories' },
  { href: '/valise', label: 'Valise', emoji: '🎒', desc: 'Liste à cocher' },
  { href: '/documents', label: 'Documents', emoji: '🛂', desc: 'Passeport, assurance...' },
  { href: '/journal', label: 'Journal', emoji: '📖', desc: 'Souvenirs jour par jour' },
  { href: '/devise', label: 'Devise', emoji: '💱', desc: 'Convertisseur' },
];

export default function Voyage() {
  const router = useRouter();
  const [stats, setStats] = useState({ hotels: 0, flights: 0, reservations: 0, activities: 0 });

  const load = useCallback(async () => {
    const db = await getDb();
    const h = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM hotels`);
    const f = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM flights`);
    const r = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM reservations`);
    const a = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(DISTINCT date) c FROM activities WHERE section = 'voyage'`);
    setStats({ hotels: h?.c ?? 0, flights: f?.c ?? 0, reservations: r?.c ?? 0, activities: a?.c ?? 0 });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const d = daysUntil('2026-06-23');
  const dEnd = daysUntil(TRIP_END_DATE);

  return (
    <Screen title="Lune de miel" subtitle="Tunisie · Paris · Grèce">
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Départ pour Paris dans</Text>
        <Text style={styles.heroDays}>{d > 0 ? `${d} jours` : 'En cours ✈️'}</Text>
        <Text style={styles.heroFoot}>{dEnd > 0 ? `Retour le 03/07 · ${dEnd} j` : 'Voyage terminé 🎉'}</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}><Text style={styles.statValue}>{stats.flights}</Text><Text style={styles.statLabel}>Vols</Text></Card>
        <Card style={styles.statCard}><Text style={styles.statValue}>{stats.hotels}</Text><Text style={styles.statLabel}>Hôtels</Text></Card>
        <Card style={styles.statCard}><Text style={styles.statValue}>{stats.activities}</Text><Text style={styles.statLabel}>Jours</Text></Card>
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
    backgroundColor: colors.honeymoon, borderRadius: radius.lg,
    padding: spacing.xl, marginBottom: spacing.lg,
  },
  heroLabel: { color: '#FFF', fontSize: fontSize.sm, opacity: 0.95, textTransform: 'uppercase', letterSpacing: 1 },
  heroDays: { color: '#FFF', fontSize: 44, fontWeight: '800', marginVertical: spacing.xs },
  heroFoot: { color: '#FFF', opacity: 0.95, fontSize: fontSize.sm },
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
