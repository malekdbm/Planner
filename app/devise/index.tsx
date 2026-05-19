import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { colors, fontSize, radius, spacing } from '@/theme';

// Taux indicatifs vs EUR (l'utilisateur peut les modifier)
const DEFAULT_RATES: Record<string, number> = {
  EUR: 1,
  TND: 3.4,
  USD: 1.09,
  GBP: 0.85,
};

const FLAGS: Record<string, string> = { EUR: '🇪🇺', TND: '🇹🇳', USD: '🇺🇸', GBP: '🇬🇧' };

export default function Devise() {
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('TND');
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState(DEFAULT_RATES);

  const n = parseFloat(amount.replace(',', '.')) || 0;
  const converted = (n * (rates[to] ?? 1)) / (rates[from] ?? 1);

  const fmt = (v: number, code: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(v);

  return (
    <Screen title="Devise" subtitle="Convertisseur (taux indicatifs)">
      <Card>
        <View style={styles.row}>
          {Object.keys(rates).map((c) => (
            <Pressable key={c} onPress={() => setFrom(c)} style={[styles.chip, from === c && styles.chipOn]}>
              <Text style={[styles.chipText, from === c && styles.chipTextOn]}>{FLAGS[c]} {c}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.bigInput}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.arrow}>↓</Text>
        <View style={styles.row}>
          {Object.keys(rates).map((c) => (
            <Pressable key={c} onPress={() => setTo(c)} style={[styles.chip, to === c && styles.chipOn]}>
              <Text style={[styles.chipText, to === c && styles.chipTextOn]}>{FLAGS[c]} {c}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.result}>{fmt(converted, to)}</Text>
      </Card>

      <Text style={styles.section}>Taux contre 1 EUR (modifiable)</Text>
      {Object.keys(rates).filter((c) => c !== 'EUR').map((c) => (
        <Field
          key={c}
          label={`${FLAGS[c]} ${c}`}
          value={String(rates[c])}
          onChange={(v) => setRates({ ...rates, [c]: parseFloat(v.replace(',', '.')) || 0 })}
          numeric
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
  bigInput: {
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.lg,
    fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center',
    borderWidth: 1, borderColor: colors.border, marginVertical: spacing.sm,
  },
  arrow: { textAlign: 'center', fontSize: 24, color: colors.textMuted, marginVertical: spacing.xs },
  result: { fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },
  section: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
});
