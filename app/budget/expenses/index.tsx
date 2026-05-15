import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Expense } from '@/db';
import { formatDateShort, formatEUR } from '@/utils/date';

export default function Expenses() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const s = section === 'voyage' ? 'voyage' : 'mariage';
  const [items, setItems] = useState<Expense[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Expense>(`SELECT * FROM expenses WHERE section = ? ORDER BY date DESC`, [s]));
  }, [s]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = items.reduce((a, e) => a + e.amount_cents, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Dépenses" subtitle={`${items.length} entrées · ${formatEUR(total)}`}>
        {items.map((e) => (
          <Pressable key={e.id} onPress={() => router.push(`/budget/expenses/${e.id}`)}>
            <Card
              title={e.vendor || e.category}
              subtitle={`${formatDateShort(e.date)} · ${e.category}${e.notes ? ' · ' + e.notes : ''}`}
              badge={formatEUR(e.amount_cents)}
              badgeColor={colors.primary}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push(`/budget/expenses/new?section=${s}`)} />
    </View>
  );
}
