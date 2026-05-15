import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Flight } from '@/db';
import { formatDateLong, formatTime } from '@/utils/date';

export default function FlightDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [pnr, setPnr] = useState('');
  const [seat, setSeat] = useState('');
  const [cabin, setCabin] = useState('');
  const [baggage, setBaggage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const f = await db.getFirstAsync<Flight>(`SELECT * FROM flights WHERE id = ?`, [Number(id)]);
    if (f) {
      setFlight(f);
      setAirline(f.airline ?? '');
      setFlightNo(f.flight_no ?? '');
      setPnr(f.pnr ?? '');
      setSeat(f.seat ?? '');
      setCabin(f.cabin ?? '');
      setBaggage(f.baggage ?? '');
      setCost(f.cost_cents ? String(f.cost_cents / 100) : '');
      setNotes(f.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const costCents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE flights SET airline = ?, flight_no = ?, pnr = ?, seat = ?, cabin = ?, baggage = ?, cost_cents = ?, notes = ? WHERE id = ?`,
      [airline, flightNo, pnr, seat, cabin, baggage, costCents, notes, Number(id)],
    );
    router.back();
  };

  if (!flight) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹ Retour</Text>
          </Pressable>
          <Text style={styles.title}>✈️ {flight.from_city} → {flight.to_city}</Text>
          <Text style={styles.subtitle}>{formatDateLong(flight.depart_at)} · {formatTime(flight.depart_at)}</Text>

          <View style={styles.route}>
            <View style={styles.routeBox}>
              <Text style={styles.routeCode}>{flight.from_code}</Text>
              <Text style={styles.routeCity}>{flight.from_city}</Text>
              <Text style={styles.routeTime}>{formatTime(flight.depart_at)}</Text>
            </View>
            <Text style={styles.routeArrow}>→</Text>
            <View style={styles.routeBox}>
              <Text style={styles.routeCode}>{flight.to_code}</Text>
              <Text style={styles.routeCity}>{flight.to_city}</Text>
            </View>
          </View>

          <Field label="Compagnie" value={airline} onChange={setAirline} placeholder="Air France, Tunisair..." />
          <Field label="N° de vol" value={flightNo} onChange={setFlightNo} placeholder="AF1234" />
          <Field label="N° de réservation (PNR)" value={pnr} onChange={setPnr} placeholder="ABCDEF" />
          <Field label="Siège" value={seat} onChange={setSeat} placeholder="12A" />
          <Field label="Classe" value={cabin} onChange={setCabin} placeholder="Économie" />
          <Field label="Bagages" value={baggage} onChange={setBaggage} placeholder="1 × 23 kg" />
          <Field label="Coût total (€)" value={cost} onChange={setCost} placeholder="0" numeric />
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Site de réservation, etc." multiline />

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
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.lg, textTransform: 'capitalize' },
  route: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  routeBox: { flex: 1, alignItems: 'center' },
  routeCode: { fontSize: 28, fontWeight: '800', color: colors.text },
  routeCity: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  routeTime: { fontSize: fontSize.sm, color: colors.flight, fontWeight: '700', marginTop: spacing.xs },
  routeArrow: { fontSize: 24, color: colors.flight, marginHorizontal: spacing.md },
  field: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs },
  input: { backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, fontSize: fontSize.md, color: colors.text, borderWidth: 1, borderColor: colors.border },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  save: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.lg },
  saveText: { color: '#FFF', fontWeight: '700', fontSize: fontSize.md },
});
