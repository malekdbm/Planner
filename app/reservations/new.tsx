import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';
import { colors, fontSize, radius, spacing } from '@/theme';

const KINDS = [
  { key: 'restaurant', label: 'Restaurant', emoji: '🍴' },
  { key: 'tour', label: 'Tour / activité', emoji: '🎟️' },
  { key: 'car', label: 'Voiture', emoji: '🚗' },
  { key: 'ferry', label: 'Ferry', emoji: '⛴️' },
  { key: 'other', label: 'Autre', emoji: '📌' },
];

export default function NewReservation() {
  const router = useRouter();
  const [kind, setKind] = useState('restaurant');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-06-25');
  const [time, setTime] = useState('19:00');

  const save = async () => {
    if (!title || !date) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO reservations (kind, title, location, starts_at) VALUES (?,?,?,?)`,
      [kind, title, location, `${date}T${time}:00`],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle réservation" onSave={save}>
      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {KINDS.map((k) => (
          <Pressable
            key={k.key}
            onPress={() => setKind(k.key)}
            style={[styles.chip, kind === k.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, kind === k.key && styles.chipTextActive]}>
              {k.emoji} {k.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Dîner Santorini Sunset" />
      <Field label="Lieu" value={location} onChange={setLocation} placeholder="Oia, Santorin" />
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} />
      <Field label="Heure (HH:MM)" value={time} onChange={setTime} />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextActive: { color: '#FFF', fontWeight: '700' },
});
