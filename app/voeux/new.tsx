import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb } from '@/db';

export default function NewVow() {
  const router = useRouter();
  const [kind, setKind] = useState<'vows' | 'speech'>('vows');
  const [title, setTitle] = useState('');

  const save = async () => {
    if (!title) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO vows (kind, title, content, updated_at) VALUES (?,?,?,?)`,
      [kind, title, '', new Date().toISOString()],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau brouillon" onSave={save}>
      <Picker label="Type" value={kind} onChange={setKind} options={[
        { key: 'vows', label: '💌 Vœux' },
        { key: 'speech', label: '🎤 Discours' },
      ]} />
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Mes vœux à toi" />
    </DetailScreen>
  );
}
