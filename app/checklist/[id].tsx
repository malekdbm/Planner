import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Task } from '@/db';

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [t, setT] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Task>(`SELECT * FROM tasks WHERE id = ?`, [Number(id)]);
    if (row) {
      setT(row); setTitle(row.title); setDue(row.due_date ?? ''); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE tasks SET title=?, due_date=?, notes=? WHERE id=?`,
      [title, due || null, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!t) return null;

  return (
    <DetailScreen title={t.section === 'mariage' ? '💍 Tâche mariage' : '✈️ Tâche voyage'} onSave={save} onDelete={remove}>
      <Field label="Titre" value={title} onChange={setTitle} />
      <Field label="Échéance (AAAA-MM-JJ)" value={due} onChange={setDue} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
