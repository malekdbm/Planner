import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type Task } from '@/db';
import { formatDateShort } from '@/utils/date';

export default function Checklist() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'mariage' | 'voyage'>('all');

  const load = useCallback(async () => {
    const db = await getDb();
    const where = filter === 'all' ? '' : `WHERE section = '${filter}'`;
    setTasks(await db.getAllAsync<Task>(`SELECT * FROM tasks ${where} ORDER BY done ASC, due_date ASC`));
  }, [filter]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (t: Task) => {
    const db = await getDb();
    await db.runAsync(`UPDATE tasks SET done = ? WHERE id = ?`, [t.done ? 0 : 1, t.id]);
    load();
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Checklist" subtitle={`${completed} / ${total} terminées`}>
        <View style={styles.filters}>
          {(['all', 'mariage', 'voyage'] as const).map((k) => (
            <Pressable key={k} onPress={() => setFilter(k)} style={[styles.chip, filter === k && styles.chipActive]}>
              <Text style={[styles.chipText, filter === k && styles.chipTextActive]}>
                {k === 'all' ? 'Tout' : k === 'mariage' ? 'Mariage' : 'Voyage'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: total ? `${(completed / total) * 100}%` : '0%' }]} />
          </View>
        </Card>

        {tasks.map((t) => (
          <Pressable key={t.id} onPress={() => toggle(t)} onLongPress={() => router.push(`/checklist/${t.id}`)}>
            <View style={[styles.task, !!t.done && styles.taskDone]}>
              <View style={[styles.check, !!t.done && styles.checkOn]}>
                {t.done ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, !!t.done && styles.titleDone]}>{t.title}</Text>
                <Text style={styles.meta}>
                  {t.section === 'mariage' ? '💍 Mariage' : '✈️ Voyage'}
                  {t.due_date ? ` · ${formatDateShort(t.due_date)}` : ''}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/checklist/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipTextActive: { color: '#FFF', fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: radius.pill, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.success },
  task: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  taskDone: { opacity: 0.6 },
  check: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border,
    marginRight: spacing.md, alignItems: 'center', justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  title: { fontSize: fontSize.md, color: colors.text, fontWeight: '500' },
  titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
