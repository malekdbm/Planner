import { ReactNode } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSize, radius, spacing } from '../theme';
import { Btn } from './Btn';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSave: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  deleteLabel?: string;
};

export function DetailScreen({ title, subtitle, children, onSave, onDelete, deleteLabel = 'Supprimer' }: Props) {
  const router = useRouter();

  const confirmDelete = () => {
    if (!onDelete) return;
    Alert.alert('Confirmer', `${deleteLabel} cet élément ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: deleteLabel, style: 'destructive', onPress: () => onDelete() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>‹ Retour</Text>
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.body}>{children}</View>
          <Btn label="Enregistrer" onPress={onSave} style={{ marginTop: spacing.md }} />
          {onDelete && (
            <Btn label={deleteLabel} variant="danger" onPress={confirmDelete} style={{ marginTop: spacing.sm }} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  back: { paddingVertical: spacing.sm },
  backText: { color: colors.primaryDark, fontSize: fontSize.md, fontWeight: '600' },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted, marginBottom: spacing.lg, textTransform: 'capitalize' },
  body: { marginTop: spacing.md },
});
