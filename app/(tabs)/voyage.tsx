import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize } from '@/theme';
import { getDb, type Hotel, type Flight, type Reservation } from '@/db';
import { formatDateShort, formatTime } from '@/utils/date';

export default function Voyage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setHotels(await db.getAllAsync<Hotel>(`SELECT * FROM hotels ORDER BY checkin`));
    setFlights(await db.getAllAsync<Flight>(`SELECT * FROM flights ORDER BY depart_at`));
    setReservations(await db.getAllAsync<Reservation>(`SELECT * FROM reservations ORDER BY starts_at`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen title="Lune de miel" subtitle="Tunisie · Paris · Grèce">
      <Text style={styles.section}>✈️ Vols & ferry</Text>
      {flights.map((f) => (
        <Pressable key={f.id} onPress={() => router.push(`/vols/${f.id}`)}>
          <Card
            title={`${f.from_city} → ${f.to_city}`}
            subtitle={`${formatDateShort(f.depart_at)} · ${formatTime(f.depart_at)}${f.airline ? ' · ' + f.airline : ''}`}
            badge={f.pnr ? 'Réservé' : 'À réserver'}
            badgeColor={f.pnr ? colors.success : colors.danger}
          />
        </Pressable>
      ))}
      {reservations
        .filter((r) => r.kind === 'ferry')
        .map((r) => (
          <Pressable key={r.id} onPress={() => router.push(`/reservations/${r.id}`)}>
            <Card
              title={`⛴️  ${r.title}`}
              subtitle={`${formatDateShort(r.starts_at)} · ${formatTime(r.starts_at)}`}
              badge={r.confirmation ? 'Réservé' : 'À réserver'}
              badgeColor={r.confirmation ? colors.success : colors.danger}
            />
          </Pressable>
        ))}

      <Text style={styles.section}>🏨 Hôtels & hébergements</Text>
      {hotels.map((h) => (
        <Pressable key={h.id} onPress={() => router.push(`/hotels/${h.id}`)}>
          <Card
            title={h.name}
            subtitle={`${formatDateShort(h.checkin)} → ${formatDateShort(h.checkout)} · ${h.nights} nuit${h.nights > 1 ? 's' : ''}${h.city ? ' · ' + h.city : ''}`}
            badge={h.confirmation ? 'Réservé' : h.kind === 'family' ? 'Famille' : 'À réserver'}
            badgeColor={h.confirmation ? colors.success : h.kind === 'family' ? colors.accent : colors.danger}
          />
        </Pressable>
      ))}

      <Text style={styles.section}>🚗 Locations & autres</Text>
      {reservations
        .filter((r) => r.kind !== 'ferry')
        .map((r) => (
          <Pressable key={r.id} onPress={() => router.push(`/reservations/${r.id}`)}>
            <Card
              title={`${r.kind === 'car' ? '🚗' : '📌'}  ${r.title}`}
              subtitle={`${formatDateShort(r.starts_at)}${r.location ? ' · ' + r.location : ''}`}
              badge={r.confirmation ? 'Réservé' : 'À réserver'}
              badgeColor={r.confirmation ? colors.success : colors.danger}
            />
          </Pressable>
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
