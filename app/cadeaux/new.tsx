import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewGift() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');

  const save = async () => {
    if (!name) return;
    const db = await getDb();
    const cents = Math.round(parseFloat(price.replace(',', '.')) * 100) || 0;
    await db.runAsync(
      `INSERT INTO gifts (name, store, link, price_cents) VALUES (?,?,?,?)`,
      [name, store, link, cents],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau cadeau" onSave={save}>
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Magasin" value={store} onChange={setStore} />
      <Field label="Lien" value={link} onChange={setLink} autoCapitalize="none" />
      <Field label="Prix (€)" value={price} onChange={setPrice} numeric />
    </DetailScreen>
  );
}
