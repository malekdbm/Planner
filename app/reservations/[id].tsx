import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Reservation } from '@/db';
import { formatDateLong, formatTime } from '@/utils/date';

export default function ReservationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [r, setR] = useState<Reservation | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Reservation>(`SELECT * FROM reservations WHERE id = ?`, [Number(id)]);
    if (row) {
      setR(row);
      setConfirmation(row.confirmation ?? '');
      setCost(row.cost_cents ? String(row.cost_cents / 100) : '');
      setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const costCents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE reservations SET confirmation = ?, cost_cents = ?, notes = ? WHERE id = ?`,
      [confirmation, costCents, notes, Number(id)],
    );
    router.back();
  };

  if (!r) return null;

  const emoji = r.kind === 'ferry' ? '⛴️' : r.kind === 'car' ? '🚗' : '📌';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹ Retour</Text>
          </Pressable>
          <Text style={styles.title}>{emoji} {r.title}</Text>
          <Text style={styles.subtitle}>
            {formatDateLong(r.starts_at)} · {formatTime(r.starts_at)}
            {r.ends_at ? ` → ${formatTime(r.ends_at)}` : ''}
          </Text>
          {r.location ? <Text style={styles.location}>📍 {r.location}</Text> : null}

          <Field label="N° de confirmation" value={confirmation} onChange={setConfirmation} placeholder="ABC123" />
          <Field label="Coût total (€)" value={cost} onChange={setCost} placeholder="0" numeric />
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Détails utiles" multiline />

          <Pressable onPress={save} style={styles.save}>
            <Text style={styles.saveText}>Enregistrer</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, numeric, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean; multiline?: boolean; }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  back: { paddingVertical: spacing.sm },
  backText: { color: colors.primaryDark, fontSize: fontSize.md, fontWeight: '600' },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.xs, textTransform: 'capitalize' },
  location: { fontSize: fontSize.md, color: colors.text, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  input: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, fontSize: fontSize.md, color: colors.text, borderWidth: 1, borderColor: colors.border },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  save: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.lg },
  saveText: { color: '#FFF', fontWeight: '700', fontSize: fontSize.md },
});
