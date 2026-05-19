import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewDayOf() {
  const router = useRouter();
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [who, setWho] = useState('');
  const [location, setLocation] = useState('');

  const save = async () => {
    if (!title || !time) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO day_of (time, title, who, location) VALUES (?,?,?,?)`,
      [time, title, who, location],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle étape jour J" onSave={save}>
      <Field label="Heure (HH:MM)" value={time} onChange={setTime} />
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Cérémonie" />
      <Field label="Qui ?" value={who} onChange={setWho} placeholder="Mariés / Famille / Tous" />
      <Field label="Lieu" value={location} onChange={setLocation} />
    </DetailScreen>
  );
}
