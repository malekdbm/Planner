import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Hotel } from '@/db';
import { formatDateShort } from '@/utils/date';

export default function HotelsList() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setHotels(await db.getAllAsync<Hotel>(`SELECT * FROM hotels ORDER BY checkin`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = hotels.reduce((acc, h) => acc + h.nights, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Hôtels & hébergements" subtitle={`${hotels.length} séjours · ${total} nuits`}>
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
      </Screen>
      <FAB onPress={() => router.push('/hotels/new')} />
    </View>
  );
}
