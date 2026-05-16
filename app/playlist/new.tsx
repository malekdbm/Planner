import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb } from '@/db';

const MOMENTS = ['Cérémonie', 'Cocktail', 'Dîner', 'Première danse', 'Soirée', 'Ne pas jouer'];

export default function NewSong() {
  const router = useRouter();
  const [moment, setMoment] = useState('Soirée');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [link, setLink] = useState('');

  const save = async () => {
    if (!title) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO playlist (moment, title, artist, link, do_not_play) VALUES (?,?,?,?,?)`,
      [moment, title, artist, link, moment === 'Ne pas jouer' ? 1 : 0],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau morceau" onSave={save}>
      <Picker label="Moment" value={moment} onChange={setMoment} options={MOMENTS.map((m) => ({ key: m, label: m }))} />
      <Field label="Titre" value={title} onChange={setTitle} placeholder="Perfect" />
      <Field label="Artiste" value={artist} onChange={setArtist} placeholder="Ed Sheeran" />
      <Field label="Lien (Spotify / YouTube)" value={link} onChange={setLink} autoCapitalize="none" />
    </DetailScreen>
  );
}
