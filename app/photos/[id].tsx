import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type ShotListItem } from '@/db';

export default function ShotDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [s, setS] = useState<ShotListItem | null>(null);
  const [category, setCategory] = useState('');
  const [label, setLabel] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<ShotListItem>(`SELECT * FROM shot_list WHERE id = ?`, [Number(id)]);
    if (row) { setS(row); setCategory(row.category); setLabel(row.label); }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(`UPDATE shot_list SET category=?, label=? WHERE id=?`, [category, label, Number(id)]);
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM shot_list WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!s) return null;
  return (
    <DetailScreen title="Cliché" onSave={save} onDelete={remove}>
      <Field label="Catégorie" value={category} onChange={setCategory} />
      <Field label="Description" value={label} onChange={setLabel} />
    </DetailScreen>
  );
}
