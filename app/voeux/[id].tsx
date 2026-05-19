import { useCallback, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Vow } from '@/db';
import { colors, fontSize, spacing } from '@/theme';

export default function VowDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [v, setV] = useState<Vow | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Vow>(`SELECT * FROM vows WHERE id = ?`, [Number(id)]);
    if (row) { setV(row); setTitle(row.title); setContent(row.content ?? ''); }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE vows SET title=?, content=?, updated_at=? WHERE id=?`,
      [title, content, new Date().toISOString(), Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM vows WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!v) return null;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readMin = Math.max(1, Math.round(wordCount / 130));

  return (
    <DetailScreen title={v.kind === 'vows' ? '💌 Vœux' : '🎤 Discours'} onSave={save} onDelete={remove}>
      <Field label="Titre" value={title} onChange={setTitle} />
      <Field label="Texte" value={content} onChange={setContent} multiline placeholder="Écris ici..." style={styles.bigInput} />
      <Text style={styles.stats}>{wordCount} mots · ~{readMin} min de lecture</Text>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  bigInput: { minHeight: 280 },
  stats: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: -spacing.sm, marginBottom: spacing.md },
});
