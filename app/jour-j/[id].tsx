import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type DayOfItem } from '@/db';

export default function DayOfDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<DayOfItem | null>(null);
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [who, setWho] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<DayOfItem>(`SELECT * FROM day_of WHERE id = ?`, [Number(id)]);
    if (row) {
      setD(row); setTime(row.time); setTitle(row.title);
      setWho(row.who ?? ''); setLocation(row.location ?? ''); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE day_of SET time=?, title=?, who=?, location=?, notes=? WHERE id=?`,
      [time, title, who, location, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM day_of WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!d) return null;
  return (
    <DetailScreen title="Étape" onSave={save} onDelete={remove}>
      <Field label="Heure (HH:MM)" value={time} onChange={setTime} />
      <Field label="Titre" value={title} onChange={setTitle} />
      <Field label="Qui ?" value={who} onChange={setWho} />
      <Field label="Lieu" value={location} onChange={setLocation} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
