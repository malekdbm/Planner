import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewPacking() {
  const router = useRouter();
  const [category, setCategory] = useState('Divers');
  const [label, setLabel] = useState('');

  const save = async () => {
    if (!label) return;
    const db = await getDb();
    await db.runAsync(`INSERT INTO packing (category, label) VALUES (?,?)`, [category, label]);
    router.back();
  };

  return (
    <DetailScreen title="Nouvel article" onSave={save}>
      <Field label="Catégorie" value={category} onChange={setCategory} placeholder="Documents, Vêtements..." />
      <Field label="Article" value={label} onChange={setLabel} placeholder="Crème solaire" />
    </DetailScreen>
  );
}
