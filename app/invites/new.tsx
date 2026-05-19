import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { Picker } from '@/components/Picker';
import { getDb } from '@/db';

type Side = 'mine' | 'partner' | 'both';
type Rsvp = 'pending' | 'yes' | 'no' | 'maybe';

export default function NewGuest() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [side, setSide] = useState<Side>('both');
  const [group, setGroup] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [rsvp, setRsvp] = useState<Rsvp>('pending');
  const [plusOne, setPlusOne] = useState<'no' | 'yes'>('no');
  const [dietary, setDietary] = useState('');

  const save = async () => {
    if (!name) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO guests (name, side, group_name, phone, email, rsvp, plus_one, dietary) VALUES (?,?,?,?,?,?,?,?)`,
      [name, side, group, phone, email, rsvp, plusOne === 'yes' ? 1 : 0, dietary],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvel invité" onSave={save}>
      <Field label="Nom complet" value={name} onChange={setName} />
      <Picker
        label="Côté"
        value={side}
        onChange={setSide}
        options={[
          { key: 'mine', label: 'Mon côté' },
          { key: 'partner', label: 'Partenaire' },
          { key: 'both', label: 'Les deux' },
        ]}
      />
      <Field label="Groupe" value={group} onChange={setGroup} placeholder="Famille, amis, collègues..." />
      <Field label="Téléphone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Picker
        label="Réponse (RSVP)"
        value={rsvp}
        onChange={setRsvp}
        options={[
          { key: 'pending', label: 'En attente' },
          { key: 'yes', label: 'Oui' },
          { key: 'maybe', label: 'Peut-être' },
          { key: 'no', label: 'Non' },
        ]}
      />
      <Picker
        label="+1"
        value={plusOne}
        onChange={setPlusOne}
        options={[{ key: 'no', label: 'Non' }, { key: 'yes', label: 'Oui' }]}
      />
      <Field label="Régime alimentaire" value={dietary} onChange={setDietary} placeholder="Végétarien, allergie..." />
    </DetailScreen>
  );
}
