import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors, fontSize } from '@/theme';
import { getDb, type Document } from '@/db';
import { daysUntil, formatDate, TRIP_END_DATE } from '@/utils/date';

const EMOJI: Record<string, string> = {
  passport: '🛂', id: '🪪', insurance: '🩺', driving: '🚗', visa: '📑', other: '📄',
};

export default function Documents() {
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setDocs(await db.getAllAsync<Document>(`SELECT * FROM documents ORDER BY kind, name`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const tripEnd = new Date(TRIP_END_DATE);
  const sixMonthsAfter = new Date(tripEnd);
  sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6);
  const sixMonthIso = sixMonthsAfter.toISOString().slice(0, 10);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Documents" subtitle="Passeport, carte d'identité, assurance...">
        {docs.map((d) => {
          let badge = '—';
          let badgeColor = colors.textMuted;
          if (d.expiry_date) {
            const daysLeft = daysUntil(d.expiry_date);
            if (daysLeft < 0) { badge = 'Expiré'; badgeColor = colors.danger; }
            else if (d.kind === 'passport' && d.expiry_date < sixMonthIso) { badge = '< 6 mois après voyage'; badgeColor = colors.danger; }
            else if (daysLeft < 90) { badge = `${daysLeft} jours`; badgeColor = colors.payment; }
            else { badge = 'Valide'; badgeColor = colors.success; }
          }
          return (
            <Pressable key={d.id} onPress={() => router.push(`/documents/${d.id}`)}>
              <Card
                title={`${EMOJI[d.kind] ?? '📄'}  ${d.name}`}
                subtitle={d.expiry_date ? `Expire le ${formatDate(d.expiry_date)}${d.number ? ' · n° ' + d.number : ''}` : (d.number ? `n° ${d.number}` : 'Aucune info')}
                badge={badge}
                badgeColor={badgeColor}
              />
            </Pressable>
          );
        })}
      </Screen>
      <FAB onPress={() => router.push('/documents/new')} />
    </View>
  );
}
