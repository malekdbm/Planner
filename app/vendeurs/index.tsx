import { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { FAB } from '@/components/Btn';
import { colors } from '@/theme';
import { getDb, type Vendor } from '@/db';
import { formatEUR } from '@/utils/date';

export default function Vendeurs() {
  const router = useRouter();
  const [items, setItems] = useState<Vendor[]>([]);

  const load = useCallback(async () => {
    const db = await getDb();
    setItems(await db.getAllAsync<Vendor>(`SELECT * FROM vendors ORDER BY category, name`));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = items.reduce((a, v) => a + v.contract_cents, 0);
  const paid = items.reduce((a, v) => a + v.deposit_cents, 0);
  const balance = total - paid;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Screen title="Prestataires" subtitle={`${items.length} · contrats ${formatEUR(total)} · reste ${formatEUR(balance)}`}>
        {items.map((v) => (
          <Pressable key={v.id} onPress={() => router.push(`/vendeurs/${v.id}`)}>
            <Card
              title={v.name}
              subtitle={`${v.category}${v.contract_cents > 0 ? ' · Contrat ' + formatEUR(v.contract_cents) : ''}${v.deposit_cents > 0 ? ' · Acompte ' + formatEUR(v.deposit_cents) : ''}`}
              badge={v.contract_cents > 0 && v.deposit_cents >= v.contract_cents ? 'Soldé' : v.deposit_cents > 0 ? 'Acompte' : 'À choisir'}
              badgeColor={v.contract_cents > 0 && v.deposit_cents >= v.contract_cents ? colors.success : v.deposit_cents > 0 ? colors.payment : colors.textMuted}
            />
          </Pressable>
        ))}
      </Screen>
      <FAB onPress={() => router.push('/vendeurs/new')} />
    </View>
  );
}
