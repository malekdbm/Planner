import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type Packing } from '@/db';

export default function Valise() {
  const router = useRouter();
  const [items, setItems] = useState<Packing[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Packing>(`SELECT * FROM packing ORDER BY category, position, id`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (it: Packing) => {
    const db = await getDb();
    await db.runAsync(`UPDATE packing SET checked = ? WHERE id = ?`, [it.checked ? 0 : 1, it.id]);
    load();
  };

  const toggleBuy = async (it: Packing) => {
    const db = await getDb();
    await db.runAsync(`UPDATE packing SET needs_buy = ? WHERE id = ?`, [it.needs_buy ? 0 : 1, it.id]);
    load();
  };

  const grouped: Record<string, Packing[]> = {};
  for (const i of items) (grouped[i.category] ||= []).push(i);
  const cats = Object.keys(grouped);
  const done = items.filter((i) => i.checked).length;
  const toBuy = items.filter((i) => i.needs_buy && !i.checked).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Valise" subtitle={`${done}/${items.length} faits · ${toBuy} à acheter`}>
        <Card>
          <View style={styles.track}>
            <View style={[styles.bar, { width: items.length ? `${(done / items.length) * 100}%` : '0%' }]} />
          </View>
        </Card>

        {cats.map((cat) => (
          <View key={cat} style={styles.section}>
            <Text style={styles.heading}>{cat}</Text>
            {grouped[cat].map((it) => (
              <View key={it.id} style={[styles.item, !!it.checked && styles.done]}>
                <Pressable onPress={() => toggle(it)} style={styles.checkWrap}>
                  <View style={[styles.check, !!it.checked && styles.checkOn]}>
                    {it.checked ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                </Pressable>
                <Pressable style={{ flex: 1 }} onLongPress={() => router.push(`/valise/${it.id}`)} onPress={() => toggle(it)}>
                  <Text style={[styles.label, !!it.checked && styles.labelDone]}>{it.label}</Text>
                </Pressable>
                <Pressable onPress={() => toggleBuy(it)}>
                  <Text style={[styles.buy, !!it.needs_buy && styles.buyOn]}>🛒</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/valise/new')} />
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
  checkWrap: { padding: spacing.xs, marginRight: spacing.xs },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  label: { fontSize: fontSize.md, color: colors.text, flex: 1 },
  labelDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  buy: { fontSize: 18, opacity: 0.3, padding: spacing.xs },
  buyOn: { opacity: 1 },
});
