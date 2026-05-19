import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb } from '@/db';
import { toISO } from '@/utils/date';

const MOODS = ['😍', '😊', '😎', '😴', '😅', '😡', '🥰', '🤔'];
type Mood = typeof MOODS[number];

export default function NewJournal() {
  const router = useRouter();
  const [date, setDate] = useState(toISO(new Date()));
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<Mood>('😊');
  const [content, setContent] = useState('');

  const save = async () => {
    if (!date) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO journal (date, location, mood, content) VALUES (?,?,?,?)`,
      [date, location, mood, content],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle entrée" onSave={save}>
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} />
      <Field label="Lieu" value={location} onChange={setLocation} placeholder="Santorin, Oia" />
      <Picker label="Humeur" value={mood} onChange={(v) => setMood(v as Mood)} options={MOODS.map((m) => ({ key: m, label: m }))} />
      <Field label="Récit" value={content} onChange={setContent} multiline placeholder="Aujourd'hui on a..." />
    </DetailScreen>
  );
}
