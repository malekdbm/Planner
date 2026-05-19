import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/components/Card';
import { colors, fontSize, radius, spacing } from '@/theme';
import { getDb } from '@/db';

type Hit = { type: string; title: string; subtitle: string; href: string; emoji: string };

export default function Recherche() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    const search = async () => {
      const db = await getDb();
      const like = `%${q}%`;
      const out: Hit[] = [];
      const guests = await db.getAllAsync<any>(`SELECT id, name, group_name FROM guests WHERE name LIKE ? OR group_name LIKE ? LIMIT 20`, [like, like]);
      for (const g of guests) out.push({ type: 'invité', title: g.name, subtitle: g.group_name ?? '—', href: `/invites/${g.id}`, emoji: '👤' });
      const hotels = await db.getAllAsync<any>(`SELECT id, name, city FROM hotels WHERE name LIKE ? OR city LIKE ? LIMIT 20`, [like, like]);
      for (const h of hotels) out.push({ type: 'hôtel', title: h.name, subtitle: h.city ?? '—', href: `/hotels/${h.id}`, emoji: '🏨' });
      const flights = await db.getAllAsync<any>(`SELECT id, from_city, to_city FROM flights WHERE from_city LIKE ? OR to_city LIKE ? OR airline LIKE ? LIMIT 20`, [like, like, like]);
      for (const f of flights) out.push({ type: 'vol', title: `${f.from_city} → ${f.to_city}`, subtitle: 'Vol', href: `/vols/${f.id}`, emoji: '✈️' });
      const tasks = await db.getAllAsync<any>(`SELECT id, title, section FROM tasks WHERE title LIKE ? LIMIT 20`, [like]);
      for (const t of tasks) out.push({ type: 'tâche', title: t.title, subtitle: t.section, href: `/checklist/${t.id}`, emoji: '✅' });
      const vendors = await db.getAllAsync<any>(`SELECT id, name, category FROM vendors WHERE name LIKE ? OR category LIKE ? LIMIT 20`, [like, like]);
      for (const v of vendors) out.push({ type: 'prestataire', title: v.name, subtitle: v.category, href: `/vendeurs/${v.id}`, emoji: '🤝' });
      const activities = await db.getAllAsync<any>(`SELECT id, title, location, date FROM activities WHERE title LIKE ? OR location LIKE ? LIMIT 20`, [like, like]);
      for (const a of activities) out.push({ type: 'activité', title: a.title, subtitle: `${a.date} · ${a.location ?? ''}`, href: `/itineraire/${a.id}`, emoji: '🗺️' });
      setHits(out);
    };
    const t = setTimeout(search, 150);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl * 2 }}>
          <Pressable onPress={() => router.back()} style={{ paddingVertical: spacing.sm }}>
            <Text style={{ color: colors.primaryDark, fontSize: fontSize.md, fontWeight: '600' }}>‹ Retour</Text>
          </Pressable>
          <Text style={styles.title}>Recherche</Text>
          <TextInput
            style={styles.input}
            value={q}
            onChangeText={setQ}
            placeholder="Tapez un nom, lieu, tâche..."
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
          {hits.length === 0 && q ? <Text style={styles.empty}>Aucun résultat</Text> : null}
          {hits.map((h, i) => (
            <Pressable key={i} onPress={() => router.push(h.href as any)}>
              <Card title={`${h.emoji}  ${h.title}`} subtitle={`${h.type} · ${h.subtitle}`} />
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginVertical: spacing.sm },
  input: {
    backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md,
    fontSize: fontSize.lg, color: colors.text, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.md,
  },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
});
