import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type Hotel } from '@/db';
import { formatDateLong } from '@/utils/date';

export default function HotelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [roomType, setRoomType] = useState('');
  const [cost, setCost] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const h = await db.getFirstAsync<Hotel>(`SELECT * FROM hotels WHERE id = ?`, [Number(id)]);
    if (h) {
      setHotel(h);
      setConfirmation(h.confirmation ?? ''); setRoomType(h.room_type ?? '');
      setCost(h.cost_cents ? String(h.cost_cents / 100) : '');
      setPhone(h.phone ?? ''); setAddress(h.address ?? ''); setNotes(h.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE hotels SET confirmation=?, room_type=?, cost_cents=?, phone=?, address=?, notes=? WHERE id=?`,
      [confirmation, roomType, cents, phone, address, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM hotels WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!hotel) return null;

  return (
    <DetailScreen
      title={`🏨 ${hotel.name}`}
      subtitle={`${hotel.city ? hotel.city + ' · ' : ''}${hotel.nights} nuit${hotel.nights > 1 ? 's' : ''}`}
      onSave={save}
      onDelete={remove}
    >
      <View style={styles.dates}>
        <Text style={styles.dateLabel}>Arrivée</Text>
        <Text style={styles.dateValue}>{formatDateLong(hotel.checkin)}</Text>
        <Text style={[styles.dateLabel, { marginTop: spacing.sm }]}>Départ</Text>
        <Text style={styles.dateValue}>{formatDateLong(hotel.checkout)}</Text>
      </View>
      <Field label="N° de confirmation" value={confirmation} onChange={setConfirmation} placeholder="ABC123" />
      <Field label="Type de chambre" value={roomType} onChange={setRoomType} placeholder="Double vue mer" />
      <Field label="Coût total (€)" value={cost} onChange={setCost} numeric />
      <Field label="Téléphone" value={phone} onChange={setPhone} placeholder="+216 ..." />
      <Field label="Adresse" value={address} onChange={setAddress} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  dates: {
    backgroundColor: colors.card, padding: spacing.lg, borderRadius: radius.md,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  dateLabel: { fontSize: fontSize.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  dateValue: { fontSize: fontSize.md, color: colors.text, fontWeight: '600', textTransform: 'capitalize' },
});
