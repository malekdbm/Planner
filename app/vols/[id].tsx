import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { colors, fontSize, radius, spacing } from '@/theme';
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
      setAirline(f.airline ?? ''); setFlightNo(f.flight_no ?? ''); setPnr(f.pnr ?? '');
      setSeat(f.seat ?? ''); setCabin(f.cabin ?? ''); setBaggage(f.baggage ?? '');
      setCost(f.cost_cents ? String(f.cost_cents / 100) : ''); setNotes(f.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE flights SET airline=?, flight_no=?, pnr=?, seat=?, cabin=?, baggage=?, cost_cents=?, notes=? WHERE id=?`,
      [airline, flightNo, pnr, seat, cabin, baggage, cents, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM flights WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!flight) return null;

  return (
    <DetailScreen
      title={`✈️ ${flight.from_city} → ${flight.to_city}`}
      subtitle={`${formatDateLong(flight.depart_at)} · ${formatTime(flight.depart_at)}`}
      onSave={save}
      onDelete={remove}
    >
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
      <Field label="Compagnie" value={airline} onChange={setAirline} placeholder="Air France" />
      <Field label="N° de vol" value={flightNo} onChange={setFlightNo} placeholder="AF1234" />
      <Field label="N° de réservation (PNR)" value={pnr} onChange={setPnr} placeholder="ABCDEF" />
      <Field label="Siège" value={seat} onChange={setSeat} placeholder="12A" />
      <Field label="Classe" value={cabin} onChange={setCabin} placeholder="Économie" />
      <Field label="Bagages" value={baggage} onChange={setBaggage} placeholder="1 × 23 kg" />
      <Field label="Coût total (€)" value={cost} onChange={setCost} numeric />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  route: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg,
    marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  routeBox: { flex: 1, alignItems: 'center' },
  routeCode: { fontSize: 28, fontWeight: '800', color: colors.text },
  routeCity: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  routeTime: { fontSize: fontSize.sm, color: colors.flight, fontWeight: '700', marginTop: spacing.xs },
  routeArrow: { fontSize: 24, color: colors.flight, marginHorizontal: spacing.md },
});
