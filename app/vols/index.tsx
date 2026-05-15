import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, spacing } from '@/theme';
import { getDb, type Flight } from '@/db';
import { formatDateShort, formatTime } from '@/utils/date';

export default function VolsList() {
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setFlights(await db.getAllAsync<Flight>(`SELECT * FROM flights ORDER BY depart_at`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Vols & ferry" subtitle={`${flights.length} trajet${flights.length > 1 ? 's' : ''}`}>
        {flights.map((f) => (
          <Pressable key={f.id} onPress={() => router.push(`/vols/${f.id}`)}>
            <Card
              title={`${f.from_city} → ${f.to_city}`}
              subtitle={`${formatDateShort(f.depart_at)} · ${formatTime(f.depart_at)}${f.airline ? ' · ' + f.airline : ''}${f.flight_no ? ' ' + f.flight_no : ''}`}
              badge={f.pnr ? 'Réservé' : 'À réserver'}
              badgeColor={f.pnr ? colors.success : colors.danger}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/vols/new')} />
    </View>
  );
}
