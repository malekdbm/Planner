import { useCallback, useState } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb, type Vendor } from '@/db';

export default function VendorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [v, setV] = useState<Vendor | null>(null);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contract, setContract] = useState('');
  const [deposit, setDeposit] = useState('');
  const [due, setDue] = useState('');
  const [meeting, setMeeting] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    const db = await getDb();
    const row = await db.getFirstAsync<Vendor>(`SELECT * FROM vendors WHERE id = ?`, [Number(id)]);
    if (row) {
      setV(row); setCategory(row.category); setName(row.name);
      setPhone(row.phone ?? ''); setEmail(row.email ?? '');
      setContract(row.contract_cents ? String(row.contract_cents / 100) : '');
      setDeposit(row.deposit_cents ? String(row.deposit_cents / 100) : '');
      setDue(row.due_date ?? ''); setMeeting(row.next_meeting ?? '');
      setNotes(row.notes ?? '');
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const save = async () => {
    const db = await getDb();
    const cC = Math.round(parseFloat(contract.replace(',', '.')) * 100) || 0;
    const dC = Math.round(parseFloat(deposit.replace(',', '.')) * 100) || 0;
    const balance = Math.max(0, cC - dC);
    await db.runAsync(
      `UPDATE vendors SET category=?, name=?, phone=?, email=?, contract_cents=?, deposit_cents=?, balance_cents=?, due_date=?, next_meeting=?, notes=? WHERE id=?`,
      [category, name, phone, email, cC, dC, balance, due || null, meeting || null, notes, Number(id)],
    );
    router.back();
  };

  const remove = async () => {
    const db = await getDb();
    await db.runAsync(`DELETE FROM vendors WHERE id = ?`, [Number(id)]);
    router.back();
  };

  if (!v) return null;
  return (
    <DetailScreen title={`🤝 ${v.name}`} subtitle={v.category} onSave={save} onDelete={remove}>
      <Field label="Catégorie" value={category} onChange={setCategory} />
      <Field label="Nom" value={name} onChange={setName} />
      <Field label="Téléphone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Field label="Montant du contrat (€)" value={contract} onChange={setContract} numeric />
      <Field label="Acompte versé (€)" value={deposit} onChange={setDeposit} numeric />
      <Field label="Date d'échéance solde" value={due} onChange={setDue} placeholder="AAAA-MM-JJ" />
      <Field label="Prochain rendez-vous" value={meeting} onChange={setMeeting} placeholder="AAAA-MM-JJ" />
      <Field label="Notes" value={notes} onChange={setNotes} multiline />
    </DetailScreen>
  );
}
