import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type TablePlan } from '@/db';

export default function TableDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [t, setT] = useState<TablePlan | null>(null);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<TablePlan>(`SELECT * FROM tables_plan WHERE id = ?`, [Number(id)]);
    if (row) { setT(row); setName(row.name); setCapacity(String(row.capacity)); }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(`UPDATE tables_plan SET name=?, capacity=? WHERE id=?`, [name, parseInt(capacity, 10) || 8, Number(id)]);
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM table_assignments WHERE table_id = ?`, [Number(id)]);
    await db.runAsync(`DELETE FROM tables_plan WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!t) return null;
  return (
    <DetailScreen title="Table" onSave={save} onDelete={remove}>
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Capacité" value={capacity} onChange={setCapacity} numeric />
    </DetailScreen>
  );
}
