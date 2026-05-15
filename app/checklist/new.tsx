import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function NewTask() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<'mariage' | 'voyage'>('mariage');
  const [due, setDue] = useState('');
  const [notes, setNotes] = useState('');

  const save = async () => {
    if (!title) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO tasks (title, section, due_date, notes) VALUES (?,?,?,?)`,
      [title, section, due || null, notes],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle tâche" onSave={save}>
      <Text style={styles.label}>Section</Text>
      <View style={styles.row}>
        <Pressable onPress={() => setSection('mariage')} style={[styles.chip, section === 'mariage' && styles.chipOn]}>
          <Text style={[styles.chipText, section === 'mariage' && styles.chipTextOn]}>💍 Mariage</Text>
        </Pressable>
        <Pressable onPress={() => setSection('voyage')} style={[styles.chip, section === 'voyage' && styles.chipOn]}>
          <Text style={[styles.chipText, section === 'voyage' && styles.chipTextOn]}>✈️ Voyage</Text>
        </Pressable>
      </View>
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Réserver fleuriste" />
      <Field label="Échéance (AAAA-MM-JJ)" value={due} onChange={setDue} placeholder="2026-06-01" />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextOn: { color: '#FFF', fontWeight: '700' },
});
