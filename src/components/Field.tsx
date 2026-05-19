import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

type Props = Omit<TextInputProps, 'onChange' | 'value'> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  multiline?: boolean;
};

export function Field({ label, value, onChange, numeric, multiline, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        style={[styles.input, multiline && styles.multi, style]}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={colors.textMuted}
        keyboardType={numeric ? 'decimal-pad' : rest.keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md,
    fontSize: fontSize.md, color: colors.text, borderWidth: 1, borderColor: colors.border,
  },
  multi: { minHeight: 80, textAlignVertical: 'top' },
});
