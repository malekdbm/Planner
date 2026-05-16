import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewTable() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('8');

  const save = async () => {
    if (!name) return;
    const db = await getDb();
    await db.runAsync(`INSERT INTO tables_plan (name, capacity) VALUES (?,?)`, [name, parseInt(capacity, 10) || 8]);
    router.back();
  };

  return (
    <DetailScreen title="Nouvelle table" onSave={save}>
      <Field label="Nom" value={name} onChange={setName} placeholder="Famille mariée" />
      <Field label="Capacité" value={capacity} onChange={setCapacity} numeric />
    </DetailScreen>
  );
}
