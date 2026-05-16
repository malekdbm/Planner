import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb } from '@/db';

type Kind = 'passport' | 'id' | 'insurance' | 'driving' | 'visa' | 'other';

export default function NewDocument() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>('passport');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  const save = async () => {
    if (!name) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO documents (kind, name, number, expiry_date) VALUES (?,?,?,?)`,
      [kind, name, number, expiry || null],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau document" onSave={save}>
      <Picker label="Type" value={kind} onChange={setKind} options={[
        { key: 'passport', label: '🛂 Passeport' },
        { key: 'id', label: '🪪 CNI' },
        { key: 'insurance', label: '🩺 Assurance' },
        { key: 'driving', label: '🚗 Permis' },
        { key: 'visa', label: '📑 Visa' },
        { key: 'other', label: '📄 Autre' },
      ]} />
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Numéro" value={number} onChange={setNumber} />
      <Field label="Date d'expiration (AAAA-MM-JJ)" value={expiry} onChange={setExpiry} />
    </DetailScreen>
  );
}
