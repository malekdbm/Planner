import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb, type Journal as JE } from '@/db';

const MOODS = ['😍', '😊', '😎', '😴', '😅', '😡', '🥰', '🤔'];

export default function JournalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [j, setJ] = useState<JE | null>(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('😊');
  const [content, setContent] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<JE>(`SELECT * FROM journal WHERE id = ?`, [Number(id)]);
    if (row) {
      setJ(row); setDate(row.date); setLocation(row.location ?? '');
      setMood(row.mood ?? '😊'); setContent(row.content ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE journal SET date=?, location=?, mood=?, content=? WHERE id=?`,
      [date, location, mood, content, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM journal WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!j) return null;
  return (
    <DetailScreen title="Entrée" onSave={save} onDelete={remove}>
      <Field label="Date" value={date} onChange={setDate} />
      <Field label="Lieu" value={location} onChange={setLocation} />
      <Picker label="Humeur" value={mood} onChange={setMood} options={MOODS.map((m) => ({ key: m, label: m }))} />
      <Field label="Récit" value={content} onChange={setContent} multiline />
    </DetailScreen>
  );
}
