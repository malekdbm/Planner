import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb, type Task, type Hotel } from '@/db';
import { daysUntil, formatDateLong, formatDateShort, WEDDING_DATE } from '@/utils/date';

export default function Mariage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [venue, setVenue] = useState<Hotel | null>(null);

  const load = useCallback(async () => {
    const db = await getDb();
    setTasks(
      await db.getAllAsync<Task>(
        `SELECT * FROM tasks WHERE section = 'mariage' ORDER BY done ASC, due_date ASC`,
      ),
    );
    setVenue(
      await db.getFirstAsync<Hotel>(
        `SELECT * FROM hotels WHERE checkin = '${WEDDING_DATE}' LIMIT 1`,
      ),
    );
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggle = async (id: number, done: number) => {
    const db = await getDb();
    await db.runAsync(`UPDATE tasks SET done = ? WHERE id = ?`, [done ? 0 : 1, id]);
    load();
  };

  const d = daysUntil(WEDDING_DATE);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;

  return (
    <Screen title="Mariage" subtitle="Tunis · 16 juin 2026">
      <View style={styles.hero}>
        <Text style={styles.heroDate}>{formatDateLong(WEDDING_DATE)}</Text>
        <Text style={styles.heroDays}>{d} jours</Text>
        {venue && (
          <Text style={styles.heroVenue}>Nuit du mariage · {venue.name}, {venue.city}</Text>
        )}
      </View>

      <Card title="Checklist" subtitle={`${completed} / ${total} terminées`}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: total ? `${(completed / total) * 100}%` : '0%' }]} />
        </View>
      </Card>

      <Text style={styles.section}>Tâches</Text>
      {tasks.map((t) => (
        <Pressable key={t.id} onPress={() => toggle(t.id, t.done)}>
          <View style={[styles.task, !!t.done && styles.taskDone]}>
            <View style={[styles.check, !!t.done && styles.checkDone]}>
              {t.done ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, !!t.done && styles.taskTitleDone]}>{t.title}</Text>
              {t.due_date ? (
                <Text style={styles.taskMeta}>Échéance · {formatDateShort(t.due_date)}</Text>
              ) : null}
            </View>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.wedding,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroDate: {
    color: '#FFF',
    fontSize: fontSize.md,
    opacity: 0.95,
    textTransform: 'capitalize',
  },
  heroDays: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '800',
    marginVertical: spacing.xs,
  },
  heroVenue: {
    color: '#FFF',
    opacity: 0.95,
    fontSize: fontSize.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.wedding,
  },
  section: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taskDone: {
    opacity: 0.6,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkMark: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  taskTitle: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
