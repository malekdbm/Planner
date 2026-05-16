import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb, type Gift } from '@/db';

export default function GiftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [g, setG] = useState<Gift | null>(null);
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [claimed, setClaimed] = useState('');
  const [received, setReceived] = useState<'no' | 'yes'>('no');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Gift>(`SELECT * FROM gifts WHERE id = ?`, [Number(id)]);
    if (row) {
      setG(row); setName(row.name); setStore(row.store ?? ''); setLink(row.link ?? '');
      setPrice(row.price_cents ? String(row.price_cents / 100) : '');
      setClaimed(row.claimed_by ?? ''); setReceived(row.received ? 'yes' : 'no');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cents = Math.round(parseFloat(price.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `UPDATE gifts SET name=?, store=?, link=?, price_cents=?, claimed_by=?, received=? WHERE id=?`,
      [name, store, link, cents, claimed, received === 'yes' ? 1 : 0, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM gifts WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!g) return null;
  return (
    <DetailScreen title={g.name} onSave={save} onDelete={remove}>
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Magasin" value={store} onChange={setStore} />
      <Field label="Lien" value={link} onChange={setLink} autoCapitalize="none" />
      <Field label="Prix (€)" value={price} onChange={setPrice} numeric />
      <Field label="Offert par" value={claimed} onChange={setClaimed} />
      <Picker label="Reçu" value={received} onChange={setReceived} options={[
        { key: 'no', label: 'Non' }, { key: 'yes', label: 'Oui' },
      ]} />
    </DetailScreen>
  );
}
