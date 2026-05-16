import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FAB } from '@/components/Btn';
import { Card } from '@/components/Card';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type PlaylistItem } from '@/db';

export default function Playlist() {
  const router = useRouter();
  const [items, setItems] = useState<PlaylistItem[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<PlaylistItem>(`SELECT * FROM playlist ORDER BY moment, position, id`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const grouped: Record<string, PlaylistItem[]> = {};
  for (const i of items) (grouped[i.moment] ||= []).push(i);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Playlist" subtitle={`${items.length} morceaux`}>
        {Object.keys(grouped).map((moment) => {
          const list = grouped[moment];
          const totalSec = list.reduce((a, x) => a + x.duration_sec, 0);
          const min = Math.floor(totalSec / 60);
          return (
            <View key={moment} style={styles.section}>
              <View style={styles.head}>
                <Text style={styles.heading}>{moment}</Text>
                {min > 0 && <Text style={styles.dur}>~{min} min</Text>}
              </View>
              {list.map((s) => (
                <Pressable key={s.id} onPress={() => router.push(`/playlist/${s.id}`)}>
                  <Card
                    title={s.title}
                    subtitle={s.artist ?? undefined}
                    badge={s.do_not_play ? '🚫' : undefined}
                    badgeColor={colors.danger}
                  />
                </Pressable>
              ))}
            </View>
          );
        })}
      </Screen>
      <FAB onPress={() => router.push('/playlist/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  heading: { fontSize: fontSize.md, fontWeight: '700', color: colors.primaryDark },
  dur: { fontSize: fontSize.xs, color: colors.textMuted },
});
