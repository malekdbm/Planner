import { Alert, View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { colors, spacing, fontSize, radius } from '@/theme';
import { getDb } from '@/db';

export default function Reglages() {
  const resetAll = () => {
    Alert.alert(
      'Réinitialiser les données',
      'Toutes les données locales seront effacées et l\'itinéraire pré-rempli sera rechargé.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            const db = await getDb();
            await db.execAsync(`
              DELETE FROM hotels;
              DELETE FROM flights;
              DELETE FROM reservations;
              DELETE FROM tasks;
              DELETE FROM expenses;
              DELETE FROM meta;
            `);
            Alert.alert('Effacé', 'Redémarre l\'app pour recharger l\'itinéraire.');
          },
        },
      ],
    );
  };

  return (
    <Screen title="Réglages">
      <Card title="Application">
        <Row label="Langue" value="Français 🇫🇷" />
        <Row label="Devise" value="EUR (€)" />
        <Row label="Format date" value="JJ/MM/AAAA" />
        <Row label="Format heure" value="24h" />
      </Card>

      <Card title="Voyage">
        <Row label="Mariage" value="16/06/2026 · Tunis" />
        <Row label="Retour à Paris" value="03/07/2026" />
        <Row label="Total nuits" value="17 nuits" />
      </Card>

      <Pressable onPress={resetAll}>
        <View style={[styles.danger]}>
          <Text style={styles.dangerText}>Réinitialiser toutes les données</Text>
        </View>
      </Pressable>

      <Text style={styles.foot}>v0.1 · stockage local uniquement</Text>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  rowValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  danger: {
    backgroundColor: colors.danger,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  dangerText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  foot: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xl,
  },
});
