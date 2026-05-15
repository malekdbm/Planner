import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, fontSize, radius } from '@/theme';
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
      setConfirmation(h.confirmation ?? '');
      setRoomType(h.room_type ?? '');
      setCost(h.cost_cents ? String(h.cost_cents / 100) : '');
      setPhone(h.phone ?? '');
      setAddress(h.address ?? '');
      setNotes(h.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const costCents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE hotels SET confirmation = ?, room_type = ?, cost_cents = ?, phone = ?, address = ?, notes = ? WHERE id = ?`,
      [confirmation, roomType, costCents, phone, address, notes, Number(id)],
    );
    router.back();
  };

  if (!hotel) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹ Retour</Text>
          </Pressable>
          <Text style={styles.title}>🏨 {hotel.name}</Text>
          <Text style={styles.subtitle}>
            {hotel.city ? hotel.city + ' · ' : ''}{hotel.nights} nuit{hotel.nights > 1 ? 's' : ''}
          </Text>

          <View style={styles.dates}>
            <Text style={styles.dateLabel}>Arrivée</Text>
            <Text style={styles.dateValue}>{formatDateLong(hotel.checkin)}</Text>
            <Text style={[styles.dateLabel, { marginTop: spacing.sm }]}>Départ</Text>
            <Text style={styles.dateValue}>{formatDateLong(hotel.checkout)}</Text>
          </View>

          <Field label="N° de confirmation" value={confirmation} onChange={setConfirmation} placeholder="ABC123" />
          <Field label="Type de chambre" value={roomType} onChange={setRoomType} placeholder="Double vue mer" />
          <Field label="Coût total (€)" value={cost} onChange={setCost} placeholder="0" numeric />
          <Field label="Téléphone" value={phone} onChange={setPhone} placeholder="+216 ..." />
          <Field label="Adresse" value={address} onChange={setAddress} placeholder="Rue, ville" />
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Petit-déjeuner inclus, annulation..." multiline />

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
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.lg },
  dates: { backgroundColor: colors.card, padding: spacing.lg, borderRadius: radius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  dateLabel: { fontSize: fontSize.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  dateValue: { fontSize: fontSize.md, color: colors.text, fontWeight: '600', textTransform: 'capitalize' },
  field: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  input: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, fontSize: fontSize.md, color: colors.text, borderWidth: 1, borderColor: colors.border },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  save: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.lg },
  saveText: { color: '#FFF', fontWeight: '700', fontSize: fontSize.md },
});
