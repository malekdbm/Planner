import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type Activity } from '@/db';
import { formatDateLong, formatEUR } from '@/utils/date';

export default function Itineraire() {
  const router = useRouter();
  const [acts, setActs] = useState<Activity[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setActs(await db.getAllAsync<Activity>(
      `SELECT * FROM activities WHERE section = 'voyage' ORDER BY date ASC, time ASC, position ASC`,
    ));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const byDate: Record<string, Activity[]> = {};
  for (const a of acts) (byDate[a.date] ||= []).push(a);
  const dates = Object.keys(byDate).sort();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Itinéraire" subtitle={`${dates.length} jours · ${acts.length} entrées`}>
        {dates.map((d) => {
          const items = byDate[d];
          const loc = items.find((i) => i.location)?.location;
          return (
            <View key={d} style={styles.day}>
              <View style={styles.dayHead}>
                <Text style={styles.dayDate}>{formatDateLong(d)}</Text>
                {loc ? <Text style={styles.dayLoc}>📍 {loc}</Text> : null}
              </View>
              {items.map((a) => (
                <Pressable key={a.id} onPress={() => router.push(`/itineraire/${a.id}`)}>
                  <View style={styles.act}>
                    {a.time ? <Text style={styles.time}>{a.time}</Text> : <Text style={styles.time}>—</Text>}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{a.title}</Text>
                      {a.location && a.location !== loc ? <Text style={styles.meta}>📍 {a.location}</Text> : null}
                      {a.cost_cents > 0 ? <Text style={styles.cost}>{formatEUR(a.cost_cents)}</Text> : null}
                    </View>
                  </View>
                </Pressable>
              ))}
              <Pressable onPress={() => router.push(`/itineraire/new?date=${d}`)}>
                <Text style={styles.addLink}>+ ajouter une activité</Text>
              </Pressable>
            </View>
          );
        })}
      </Screen>
      <FAB onPress={() => router.push('/itineraire/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  day: { marginBottom: spacing.lg },
  dayHead: { marginBottom: spacing.sm },
  dayDate: { fontSize: fontSize.md, fontWeight: '700', color: colors.primaryDark, textTransform: 'capitalize' },
  dayLoc: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  act: {
    flexDirection: 'row', backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md,
    marginBottom: spacing.xs, borderWidth: 1, borderColor: colors.border,
  },
  time: { width: 60, fontWeight: '700', color: colors.honeymoon, fontSize: fontSize.sm },
  title: { fontSize: fontSize.md, color: colors.text, fontWeight: '500' },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  cost: { fontSize: fontSize.xs, color: colors.primary, marginTop: 2, fontWeight: '600' },
  addLink: { color: colors.primaryDark, fontSize: fontSize.sm, marginTop: spacing.xs, paddingVertical: spacing.xs },
});
