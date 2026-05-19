import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type BudgetCategory } from '@/db';
import { formatEUR } from '@/utils/date';

type Row = BudgetCategory & { spent_cents: number };

export default function Budget() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();
  const initial = (params.section === 'voyage' ? 'voyage' : 'mariage') as 'mariage' | 'voyage';
  const [section, setSection] = useState<'mariage' | 'voyage'>(initial);
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    const cats = await db.getAllAsync<BudgetCategory>(
      `SELECT * FROM budget_categories WHERE section = ? ORDER BY position`,
      [section],
    );
    const out: Row[] = [];
    for (const c of cats) {
      const r = await db.getFirstAsync<{ s: number }>(
        `SELECT IFNULL(SUM(amount_cents), 0) as s FROM expenses WHERE section = ? AND category = ?`,
        [section, c.name],
      );
      out.push({ ...c, spent_cents: r?.s ?? 0 });
    }
    setRows(out);
  }, [section]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const totalPlanned = rows.reduce((a, r) => a + r.planned_cents, 0);
  const totalSpent = rows.reduce((a, r) => a + r.spent_cents, 0);
  const remaining = totalPlanned - totalSpent;
  const over = remaining < 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Budget" subtitle={section === 'mariage' ? '💍 Mariage' : '✈️ Voyage'}>
        <View style={styles.tabs}>
          <Pressable onPress={() => setSection('mariage')} style={[styles.tab, section === 'mariage' && styles.tabOn]}>
            <Text style={[styles.tabText, section === 'mariage' && styles.tabTextOn]}>💍 Mariage</Text>
          </Pressable>
          <Pressable onPress={() => setSection('voyage')} style={[styles.tab, section === 'voyage' && styles.tabOn]}>
            <Text style={[styles.tabText, section === 'voyage' && styles.tabTextOn]}>✈️ Voyage</Text>
          </Pressable>
        </View>

        <Card>
          <View style={styles.summary}>
            <View style={styles.col}>
              <Text style={styles.colLabel}>Prévu</Text>
              <Text style={styles.colValue}>{formatEUR(totalPlanned)}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.colLabel}>Dépensé</Text>
              <Text style={styles.colValue}>{formatEUR(totalSpent)}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.colLabel}>{over ? 'Dépassement' : 'Reste'}</Text>
              <Text style={[styles.colValue, { color: over ? colors.danger : colors.success }]}>
                {formatEUR(Math.abs(remaining))}
              </Text>
            </View>
          </View>
        </Card>

        <Pressable onPress={() => router.push(`/budget/expenses?section=${section}`)}>
          <Card title="🧾 Voir toutes les dépenses" subtitle="Ajouter / éditer un reçu" />
        </Pressable>

        <Text style={styles.section}>Catégories</Text>
        {rows.map((r) => {
          const pct = r.planned_cents > 0 ? Math.min(100, (r.spent_cents / r.planned_cents) * 100) : 0;
          const overC = r.spent_cents > r.planned_cents && r.planned_cents > 0;
          return (
            <Pressable key={r.id} onPress={() => router.push(`/budget/categories/${r.id}`)}>
              <View style={styles.catCard}>
                <View style={styles.catRow}>
                  <Text style={styles.catEmoji}>{r.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catName}>{r.name}</Text>
                    <Text style={styles.catSub}>{formatEUR(r.spent_cents)} / {formatEUR(r.planned_cents)}</Text>
                  </View>
                </View>
                <View style={styles.track}>
                  <View style={[styles.bar, { width: `${pct}%`, backgroundColor: overC ? colors.danger : colors.primary }]} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </Screen>
      <FAB onPress={() => router.push(`/budget/expenses/new?section=${section}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  tabTextOn: { color: '#FFF' },
  summary: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { alignItems: 'center', flex: 1 },
  colLabel: { fontSize: fontSize.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  colValue: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: 4 },
  section: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  catCard: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  catEmoji: { fontSize: 24, marginRight: spacing.sm },
  catName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  catSub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  track: { height: 6, backgroundColor: colors.border, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: '100%' },
});
