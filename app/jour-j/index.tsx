import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type DayOfItem } from '@/db';
import { WEDDING_DATE } from '@/utils/date';

export default function JourJ() {
  const router = useRouter();
  const [items, setItems] = useState<DayOfItem[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<DayOfItem>(`SELECT * FROM day_of ORDER BY time, position`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const isWeddingDay = today === WEDDING_DATE;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Jour J" subtitle="Planning minute par minute">
        {items.map((it, idx) => {
          const [hStr, mStr] = it.time.split(':');
          const min = (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
          const next = items[idx + 1];
          const nextMin = next ? (parseInt(next.time.split(':')[0], 10) || 0) * 60 + (parseInt(next.time.split(':')[1], 10) || 0) : null;
          const isNow = isWeddingDay && nowMin >= min && (nextMin === null || nowMin < nextMin);
          return (
            <Pressable key={it.id} onPress={() => router.push(`/jour-j/${it.id}`)}>
              <View style={[styles.row, isNow && styles.rowNow]}>
                <Text style={[styles.time, isNow && styles.timeNow]}>{it.time}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, isNow && styles.titleNow]}>{it.title}</Text>
                  {it.who ? <Text style={styles.who}>👤 {it.who}</Text> : null}
                  {it.location ? <Text style={styles.loc}>📍 {it.location}</Text> : null}
                  {isNow && <Text style={styles.nowBadge}>EN COURS</Text>}
                </View>
              </View>
            </Pressable>
          );
        })}
      </Screen>
      <FAB onPress={() => router.push('/jour-j/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.card,
    padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  rowNow: { borderColor: colors.wedding, borderWidth: 2, backgroundColor: '#FFF5F8' },
  time: { width: 60, fontWeight: '700', color: colors.primaryDark, fontSize: fontSize.md },
  timeNow: { color: colors.wedding },
  title: { fontSize: fontSize.md, color: colors.text, fontWeight: '600' },
  titleNow: { color: colors.wedding },
  who: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  loc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  nowBadge: { fontSize: fontSize.xs, fontWeight: '800', color: colors.wedding, marginTop: 4, letterSpacing: 1 },
});
