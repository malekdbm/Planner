import { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type BudgetCategory } from '@/db';
import { colors, fontSize, radius, spacing } from '@/theme';
import { toISO } from '@/utils/date';

export default function NewExpense() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const s = section === 'voyage' ? 'voyage' : 'mariage';
  const [cats, setCats] = useState<BudgetCategory[]>([]);
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(toISO(new Date()));
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const rows = await db.getAllAsync<BudgetCategory>(
      `SELECT * FROM budget_categories WHERE section = ? ORDER BY position`,
      [s],
    );
    setCats(rows);
    if (rows[0]) setCategory(rows[0].name);
  }, [s]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!amount || !category) return;
    const cents = Math.round(parseFloat(amount.replace(',', '.')) * 100);
    if (!cents) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO expenses (section, category, vendor, amount_cents, date, notes) VALUES (?,?,?,?,?,?)`,
      [s, category, vendor, cents, date, notes],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle dépense" subtitle={s === 'mariage' ? '💍 Mariage' : '✈️ Voyage'} onSave={save}>
      <Text style={styles.label}>Catégorie</Text>
      <View style={styles.chips}>
        {cats.map((c) => (
          <Pressable key={c.id} onPress={() => setCategory(c.name)} style={[styles.chip, category === c.name && styles.chipOn]}>
            <Text style={[styles.chipText, category === c.name && styles.chipTextOn]}>{c.emoji} {c.name}</Text>
          </Pressable>
        ))}
      </View>
      <Field label="Montant (€)" value={amount} onChange={setAmount} numeric />
      <Field label="Fournisseur" value={vendor} onChange={setVendor} placeholder="Photographe, restaurant..." />
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
});
