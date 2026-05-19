import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

type Option<T extends string> = { key: T; label: string };
type Props<T extends string> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
};

export function Picker<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((o) => (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.chip, value === o.key && styles.chipOn]}>
            <Text style={[styles.chipText, value === o.key && styles.chipTextOn]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
});
