import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Journal as JE } from '@/db';
import { formatDateLong } from '@/utils/date';

export default function Journal() {
  const router = useRouter();
  const [items, setItems] = useState<JE[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<JE>(`SELECT * FROM journal ORDER BY date DESC`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Journal" subtitle={`${items.length} entrées`}>
        {items.map((j) => (
          <Pressable key={j.id} onPress={() => router.push(`/journal/${j.id}`)}>
            <Card
              title={`${j.mood ? j.mood + '  ' : ''}${formatDateLong(j.date)}`}
              subtitle={j.location ?? undefined}
            >
              {j.content ? (
                <></>
              ) : null}
            </Card>
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/journal/new')} />
    </View>
  );
}
