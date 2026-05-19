import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { colors, fontSize, spacing } from '@/theme';
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
    const cents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE reservations SET confirmation=?, cost_cents=?, notes=? WHERE id=?`,
      [confirmation, cents, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM reservations WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!r) return null;
  const emoji = r.kind === 'ferry' ? '⛴️' : r.kind === 'car' ? '🚗' : r.kind === 'tour' ? '🎟️' : r.kind === 'restaurant' ? '🍴' : '📌';

  return (
    <DetailScreen
      title={`${emoji} ${r.title}`}
      subtitle={`${formatDateLong(r.starts_at)} · ${formatTime(r.starts_at)}${r.ends_at ? ' → ' + formatTime(r.ends_at) : ''}`}
      onSave={save}
      onDelete={remove}
    >
      {r.location ? <Text style={styles.location}>📍 {r.location}</Text> : null}
      <Field label="N° de confirmation" value={confirmation} onChange={setConfirmation} />
      <Field label="Coût total (€)" value={cost} onChange={setCost} numeric />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  location: { fontSize: fontSize.md, color: colors.text, marginBottom: spacing.lg },
});
