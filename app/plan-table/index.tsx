import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb, type TablePlan, type Guest } from '@/db';

type TableWithGuests = TablePlan & { guests: Guest[] };

export default function PlanTable() {
  const router = useRouter();
  const [tables, setTables] = useState<TableWithGuests[]>([]);
  const [unassigned, setUnassigned] = useState<Guest[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    const t = await db.getAllAsync<TablePlan>(`SELECT * FROM tables_plan ORDER BY name`);
    const out: TableWithGuests[] = [];
    for (const tb of t) {
      const guests = await db.getAllAsync<Guest>(
        `SELECT g.* FROM guests g JOIN table_assignments a ON g.id = a.guest_id WHERE a.table_id = ? ORDER BY g.name`,
        [tb.id],
      );
      out.push({ ...tb, guests });
    }
    setTables(out);
    setUnassigned(
      await db.getAllAsync<Guest>(
        `SELECT * FROM guests WHERE rsvp != 'no' AND id NOT IN (SELECT guest_id FROM table_assignments) ORDER BY name`,
      ),
    );
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const assign = async (guest: Guest) => {
    if (tables.length === 0) {
      Alert.alert('Aucune table', 'Crée d\'abord une table.');
      return;
    }
    Alert.alert(
      `Asseoir ${guest.name}`,
      'Choisir une table',
      tables
        .filter((t) => t.guests.length < t.capacity)
        .map((t) => ({
          text: `${t.name} (${t.guests.length}/${t.capacity})`,
          onPress: async () => {
            const db = await getDb();
            await db.runAsync(`INSERT OR REPLACE INTO table_assignments (table_id, guest_id) VALUES (?,?)`, [t.id, guest.id]);
            load();
          },
        }))
        .concat([{ text: 'Annuler', onPress: () => Promise.resolve() }]),
    );
  };

  const unassign = async (guest: Guest) => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM table_assignments WHERE guest_id = ?`, [guest.id]);
    load();
  };

  const seated = tables.reduce((a, t) => a + t.guests.length, 0);
  const capacity = tables.reduce((a, t) => a + t.capacity, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Plan de table" subtitle={`${tables.length} tables · ${seated}/${capacity} places`}>
        {tables.map((t) => {
          const over = t.guests.length > t.capacity;
          return (
            <Pressable key={t.id} onLongPress={() => router.push(`/plan-table/${t.id}`)}>
              <Card
                title={t.name}
                subtitle={`${t.guests.length}/${t.capacity} ${over ? '⚠️ surcapacité' : ''}`}
              >
                {t.guests.map((g) => (
                  <Pressable key={g.id} onPress={() => unassign(g)}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>{g.name}</Text>
                      <Text style={styles.chipX}>✕</Text>
                    </View>
                  </Pressable>
                ))}
                {t.guests.length === 0 && (
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Aucun invité</Text>
                )}
              </Card>
            </Pressable>
          );
        })}

        <Text style={styles.section}>Non placés ({unassigned.length})</Text>
        {unassigned.map((g) => (
          <Pressable key={g.id} onPress={() => assign(g)}>
            <Card title={g.name} subtitle="Tap pour placer" />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/plan-table/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: colors.background, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm,
    borderRadius: radius.pill, marginRight: spacing.xs, marginTop: spacing.xs,
    borderWidth: 1, borderColor: colors.border,
  },
  chipText: { fontSize: fontSize.sm, color: colors.text },
  chipX: { fontSize: fontSize.xs, color: colors.textMuted, marginLeft: 6 },
});
