import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb, type Guest } from '@/db';

type Side = 'mine' | 'partner' | 'both';
type Rsvp = 'pending' | 'yes' | 'no' | 'maybe';

export default function GuestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [g, setG] = useState<Guest | null>(null);
  const [name, setName] = useState('');
  const [side, setSide] = useState<Side>('both');
  const [group, setGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rsvp, setRsvp] = useState<Rsvp>('pending');
  const [plusOne, setPlusOne] = useState<'no' | 'yes'>('no');
  const [dietary, setDietary] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Guest>(`SELECT * FROM guests WHERE id = ?`, [Number(id)]);
    if (row) {
      setG(row); setName(row.name); setSide(row.side as Side);
      setGroup(row.group_name ?? ''); setPhone(row.phone ?? ''); setEmail(row.email ?? '');
      setRsvp(row.rsvp as Rsvp); setPlusOne(row.plus_one ? 'yes' : 'no');
      setDietary(row.dietary ?? ''); setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE guests SET name=?, side=?, group_name=?, phone=?, email=?, rsvp=?, plus_one=?, dietary=?, notes=? WHERE id=?`,
      [name, side, group, phone, email, rsvp, plusOne === 'yes' ? 1 : 0, dietary, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM guests WHERE id = ?`, [Number(id)]);
    await db.runAsync(`DELETE FROM table_assignments WHERE guest_id = ?`, [Number(id)]);
    router.back();
  };

  if (!g) return null;
  return (
    <DetailScreen title={`👤 ${g.name}`} onSave={save} onDelete={remove}>
      <Field label="Nom complet" value={name} onChange={setName} />
      <Picker label="Côté" value={side} onChange={setSide} options={[
        { key: 'mine', label: 'Mon côté' },
        { key: 'partner', label: 'Partenaire' },
        { key: 'both', label: 'Les deux' },
      ]} />
      <Field label="Groupe" value={group} onChange={setGroup} />
      <Field label="Téléphone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Picker label="Réponse" value={rsvp} onChange={setRsvp} options={[
        { key: 'pending', label: 'En attente' },
        { key: 'yes', label: 'Oui' },
        { key: 'maybe', label: 'Peut-être' },
        { key: 'no', label: 'Non' },
      ]} />
      <Picker label="+1" value={plusOne} onChange={setPlusOne} options={[
        { key: 'no', label: 'Non' }, { key: 'yes', label: 'Oui' },
      ]} />
      <Field label="Régime alimentaire" value={dietary} onChange={setDietary} />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
