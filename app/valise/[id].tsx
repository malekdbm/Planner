import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Packing } from '@/db';

export default function PackingEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [p, setP] = useState<Packing | null>(null);
  const [category, setCategory] = useState('');
  const [label, setLabel] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Packing>(`SELECT * FROM packing WHERE id = ?`, [Number(id)]);
    if (row) { setP(row); setCategory(row.category); setLabel(row.label); }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(`UPDATE packing SET category=?, label=? WHERE id=?`, [category, label, Number(id)]);
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM packing WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!p) return null;
  return (
    <DetailScreen title="Article valise" onSave={save} onDelete={remove}>
      <Field label="Catégorie" value={category} onChange={setCategory} />
      <Field label="Article" value={label} onChange={setLabel} />
    </DetailScreen>
  );
}
