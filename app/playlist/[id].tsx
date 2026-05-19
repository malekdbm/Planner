import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb, type PlaylistItem } from '@/db';

const MOMENTS = ['Cérémonie', 'Cocktail', 'Dîner', 'Première danse', 'Soirée', 'Ne pas jouer'];

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [s, setS] = useState<PlaylistItem | null>(null);
  const [moment, setMoment] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [link, setLink] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<PlaylistItem>(`SELECT * FROM playlist WHERE id = ?`, [Number(id)]);
    if (row) {
      setS(row); setMoment(row.moment); setTitle(row.title);
      setArtist(row.artist ?? ''); setLink(row.link ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE playlist SET moment=?, title=?, artist=?, link=?, do_not_play=? WHERE id=?`,
      [moment, title, artist, link, moment === 'Ne pas jouer' ? 1 : 0, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM playlist WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!s) return null;
  return (
    <DetailScreen title="Morceau" onSave={save} onDelete={remove}>
      <Picker label="Moment" value={moment} onChange={setMoment} options={MOMENTS.map((m) => ({ key: m, label: m }))} />
      <Field label="Titre" value={title} onChange={setTitle} />
      <Field label="Artiste" value={artist} onChange={setArtist} />
      <Field label="Lien" value={link} onChange={setLink} autoCapitalize="none" />
    </DetailScreen>
  );
}
