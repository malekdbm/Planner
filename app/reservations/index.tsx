import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Reservation } from '@/db';
import { formatDateShort, formatTime } from '@/utils/date';

const EMOJI: Record<string, string> = { ferry: '⛴️', car: '🚗', tour: '🎟️', restaurant: '🍴', other: '📌' };

export default function ReservationsList() {
  const router = useRouter();
  const [items, setItems] = useState<Reservation[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Reservation>(`SELECT * FROM reservations ORDER BY starts_at`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Réservations" subtitle={`${items.length} élément${items.length > 1 ? 's' : ''}`}>
        {items.map((r) => (
          <Pressable key={r.id} onPress={() => router.push(`/reservations/${r.id}`)}>
            <Card
              title={`${EMOJI[r.kind] ?? '📌'}  ${r.title}`}
              subtitle={`${formatDateShort(r.starts_at)} · ${formatTime(r.starts_at)}${r.location ? ' · ' + r.location : ''}`}
              badge={r.confirmation ? 'Réservé' : 'À réserver'}
              badgeColor={r.confirmation ? colors.success : colors.danger}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/reservations/new')} />
    </View>
  );
}
