import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Expense } from '@/db';

export default function ExpenseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [e, setE] = useState<Expense | null>(null);
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Expense>(`SELECT * FROM expenses WHERE id = ?`, [Number(id)]);
    if (row) {
      setE(row); setCategory(row.category); setVendor(row.vendor ?? '');
      setAmount(String(row.amount_cents / 100)); setDate(row.date); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(amount.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE expenses SET category=?, vendor=?, amount_cents=?, date=?, notes=? WHERE id=?`,
      [category, vendor, cents, date, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM expenses WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!e) return null;
  return (
    <DetailScreen title="Dépense" subtitle={e.section === 'mariage' ? '💍 Mariage' : '✈️ Voyage'} onSave={save} onDelete={remove}>
      <Field label="Catégorie" value={category} onChange={setCategory} />
      <Field label="Fournisseur" value={vendor} onChange={setVendor} />
      <Field label="Montant (€)" value={amount} onChange={setAmount} numeric />
      <Field label="Date" value={date} onChange={setDate} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
