import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewActivity() {
  const router = useRouter();
  const { date: initDate } = useLocalSearchParams<{ date?: string }>();
  const [date, setDate] = useState(initDate ?? '2026-06-26');
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');

  const save = async () => {
    if (!title || !date) return;
    const db = await getDb();
    const cents = Math.round(parseFloat(cost.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `INSERT INTO activities (section, date, time, title, location, cost_cents, notes) VALUES ('voyage', ?, ?, ?, ?, ?, ?)`,
      [date, time, title, location, cents, notes],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle activité" onSave={save}>
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} />
      <Field label="Heure (HH:MM)" value={time} onChange={setTime} placeholder="14:00 (optionnel)" />
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Visite de Knossos" />
      <Field label="Lieu" value={location} onChange={setLocation} placeholder="Héraklion" />
      <Field label="Coût (€)" value={cost} onChange={setCost} numeric />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
