import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Gift } from '@/db';
import { formatEUR } from '@/utils/date';

export default function Cadeaux() {
  const router = useRouter();
  const [items, setItems] = useState<Gift[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Gift>(`SELECT * FROM gifts ORDER BY received, name`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = items.reduce((a, g) => a + g.price_cents, 0);
  const received = items.filter((g) => g.received).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Cadeaux" subtitle={`${items.length} idées · ${received} reçus · ${formatEUR(total)}`}>
        {items.map((g) => (
          <Pressable key={g.id} onPress={() => router.push(`/cadeaux/${g.id}`)}>
            <Card
              title={g.name}
              subtitle={`${g.store ?? ''}${g.price_cents > 0 ? ' · ' + formatEUR(g.price_cents) : ''}${g.claimed_by ? ' · de ' + g.claimed_by : ''}`}
              badge={g.received ? 'Reçu' : 'En attente'}
              badgeColor={g.received ? colors.success : colors.textMuted}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/cadeaux/new')} />
    </View>
  );
}
