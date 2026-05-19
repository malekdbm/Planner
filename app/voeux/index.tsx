import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, spacing } from '@/theme';
import { getDb, type Vow } from '@/db';

export default function Voeux() {
  const router = useRouter();
  const [items, setItems] = useState<Vow[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Vow>(`SELECT * FROM vows ORDER BY kind, id`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const vows = items.filter((i) => i.kind === 'vows');
  const speeches = items.filter((i) => i.kind === 'speech');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Vœux & discours" subtitle="Brouillons privés">
        <Text style={styles.section}>💌 Vœux</Text>
        {vows.map((v) => (
          <Pressable key={v.id} onPress={() => router.push(`/voeux/${v.id}`)}>
            <Card title={v.title} subtitle={v.content ? v.content.slice(0, 80) + (v.content.length > 80 ? '…' : '') : 'Brouillon vide'} />
          </Pressable>
        ))}
        <Text style={styles.section}>🎤 Discours</Text>
        {speeches.map((v) => (
          <Pressable key={v.id} onPress={() => router.push(`/voeux/${v.id}`)}>
            <Card title={v.title} subtitle={v.content ? v.content.slice(0, 80) + (v.content.length > 80 ? '…' : '') : 'Brouillon vide'} />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/voeux/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
});
