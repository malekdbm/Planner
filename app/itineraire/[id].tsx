import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Activity } from '@/db';

export default function ActivityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [a, setA] = useState<Activity | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Activity>(`SELECT * FROM activities WHERE id = ?`, [Number(id)]);
    if (row) {
      setA(row); setDate(row.date); setTime(row.time ?? ''); setTitle(row.title);
      setLocation(row.location ?? ''); setCost(row.cost_cents ? String(row.cost_cents / 100) : ''); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE activities SET date=?, time=?, title=?, location=?, cost_cents=?, notes=? WHERE id=?`,
      [date, time, title, location, cents, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM activities WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!a) return null;
  return (
    <DetailScreen title="Activité" onSave={save} onDelete={remove}>
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} />
      <Field label="Heure" value={time} onChange={setTime} />
      <Field label="Titre" value={title} onChange={setTitle} />
      <Field label="Lieu" value={location} onChange={setLocation} />
      <Field label="Coût (€)" value={cost} onChange={setCost} numeric />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
