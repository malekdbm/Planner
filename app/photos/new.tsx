import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewShot() {
  const router = useRouter();
  const [category, setCategory] = useState('Couple');
  const [label, setLabel] = useState('');

  const save = async () => {
    if (!label) return;
    const db = await getDb();
    await db.runAsync(`INSERT INTO shot_list (category, label) VALUES (?,?)`, [category, label]);
    router.back();
  };

  return (
    <DetailScreen title="Nouveau cliché" onSave={save}>
      <Field label="Catégorie" value={category} onChange={setCategory} placeholder="Préparatifs, Famille..." />
      <Field label="Description" value={label} onChange={setLabel} placeholder="Mariée + parents" />
    </DetailScreen>
  );
}
