import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type ShotListItem } from '@/db';

export default function Photos() {
  const router = useRouter();
  const [items, setItems] = useState<ShotListItem[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<ShotListItem>(`SELECT * FROM shot_list ORDER BY category, position, id`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (it: ShotListItem) => {
    const db = await getDb();
    await db.runAsync(`UPDATE shot_list SET done = ? WHERE id = ?`, [it.done ? 0 : 1, it.id]);
    load();
  };

  const grouped: Record<string, ShotListItem[]> = {};
  for (const i of items) (grouped[i.category] ||= []).push(i);
  const done = items.filter((i) => i.done).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Photos" subtitle={`${done}/${items.length} clichés`}>
        <Card>
          <View style={styles.track}>
            <View style={[styles.bar, { width: items.length ? `${(done / items.length) * 100}%` : '0%' }]} />
          </View>
        </Card>

        {Object.keys(grouped).map((cat) => (
          <View key={cat} style={styles.section}>
            <Text style={styles.heading}>{cat}</Text>
            {grouped[cat].map((it) => (
              <Pressable key={it.id} onPress={() => toggle(it)} onLongPress={() => router.push(`/photos/${it.id}`)}>
                <View style={[styles.item, !!it.done && styles.done]}>
                  <View style={[styles.check, !!it.done && styles.checkOn]}>
                    {it.done ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                  <Text style={[styles.label, !!it.done && styles.labelDone]}>{it.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/photos/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: colors.border, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.success },
  section: { marginTop: spacing.md },
  heading: { fontSize: fontSize.md, fontWeight: '700', color: colors.primaryDark, marginBottom: spacing.sm },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.xs,
    borderWidth: 1, borderColor: colors.border,
  },
  done: { opacity: 0.6 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  label: { fontSize: fontSize.md, color: colors.text, flex: 1 },
  labelDone: { textDecorationLine: 'line-through', color: colors.textMuted },
});
