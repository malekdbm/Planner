import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewVendor() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const save = async () => {
    if (!category || !name) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO vendors (category, name, phone, email) VALUES (?,?,?,?)`,
      [category, name, phone, email],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau prestataire" onSave={save}>
      <Field label="Catégorie" value={category} onChange={setCategory} placeholder="Photographe, fleuriste..." />
      <Field label="Nom" value={name} onChange={setName} placeholder="Studio XYZ" />
      <Field label="Téléphone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
    </DetailScreen>
  );
}
