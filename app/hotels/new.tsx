import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export default function NewHotel() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [checkin, setCheckin] = useState('2026-06-16');
  const [checkout, setCheckout] = useState('2026-06-17');

  const save = async () => {
    if (!name || !checkin || !checkout) return;
    const nights = Math.max(1, differenceInCalendarDays(parseISO(checkout), parseISO(checkin)));
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO hotels (name, city, country, checkin, checkout, nights, kind) VALUES (?,?,?,?,?,?,?)`,
      [name, city, country, checkin, checkout, nights, 'hotel'],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouvel hôtel" onSave={save}>
      <Field label="Nom" value={name} onChange={setName} placeholder="Mövenpick Gammarth" />
      <Field label="Ville" value={city} onChange={setCity} placeholder="Tunis" />
      <Field label="Pays" value={country} onChange={setCountry} placeholder="Tunisie" />
      <Field label="Arrivée (AAAA-MM-JJ)" value={checkin} onChange={setCheckin} />
      <Field label="Départ (AAAA-MM-JJ)" value={checkout} onChange={setCheckout} />
    </DetailScreen>
  );
}
