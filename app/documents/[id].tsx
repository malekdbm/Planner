import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Document } from '@/db';

export default function DocumentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Document | null>(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Document>(`SELECT * FROM documents WHERE id = ?`, [Number(id)]);
    if (row) {
      setD(row); setName(row.name); setNumber(row.number ?? '');
      setExpiry(row.expiry_date ?? ''); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE documents SET name=?, number=?, expiry_date=?, notes=? WHERE id=?`,
      [name, number, expiry || null, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM documents WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!d) return null;
  return (
    <DetailScreen title={d.name} onSave={save} onDelete={remove}>
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Numéro" value={number} onChange={setNumber} />
      <Field label="Date d'expiration" value={expiry} onChange={setExpiry} placeholder="AAAA-MM-JJ" />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
