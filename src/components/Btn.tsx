import { Pressable, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  style?: ViewStyle;
};

export function Btn({ label, onPress, variant = 'primary', style }: Props) {
  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'danger' ? colors.danger :
    'transparent';
  const fg = variant === 'ghost' ? colors.primaryDark : '#FFF';
  return (
    <Pressable onPress={onPress} style={[styles.btn, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function FAB({ onPress, label = '＋' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable onPress={onPress} style={fabStyles.fab}>
      <Text style={fabStyles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: spacing.lg, borderRadius: radius.md, alignItems: 'center' },
  text: { fontWeight: '700', fontSize: fontSize.md },
});

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 16, bottom: 100,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  label: { color: '#FFF', fontSize: 30, fontWeight: '300', lineHeight: 32 },
});
