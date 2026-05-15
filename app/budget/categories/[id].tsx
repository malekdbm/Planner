import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type BudgetCategory } from '@/db';

export default function CategoryEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<BudgetCategory | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [planned, setPlanned] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<BudgetCategory>(`SELECT * FROM budget_categories WHERE id = ?`, [Number(id)]);
    if (row) {
      setC(row); setName(row.name); setEmoji(row.emoji ?? '');
      setPlanned(row.planned_cents ? String(row.planned_cents / 100) : '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(planned.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE budget_categories SET name=?, emoji=?, planned_cents=? WHERE id=?`,
      [name, emoji, cents, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM budget_categories WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!c) return null;
  return (
    <DetailScreen title={`Catégorie · ${c.section === 'mariage' ? 'mariage' : 'voyage'}`} onSave={save} onDelete={remove}>
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Emoji" value={emoji} onChange={setEmoji} placeholder="🍽️" />
      <Field label="Budget prévu (€)" value={planned} onChange={setPlanned} numeric />
    </DetailScreen>
  );
}
