import { useState } from 'react';
import { useRouter } from 'expo-router';
import { DetailScreen } from '@/components/DetailScreen';
import { Field } from '@/components/Field';
import { getDb } from '@/db';

export default function NewFlight() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState('');
  const [fromCode, setFromCode] = useState('');
  const [toCity, setToCity] = useState('');
  const [toCode, setToCode] = useState('');
  const [date, setDate] = useState('2026-06-23');
  const [time, setTime] = useState('10:00');
  const [airline, setAirline] = useState('');
  const [flightNo, setFlightNo] = useState('');

  const save = async () => {
    if (!fromCity || !toCity || !date) return;
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO flights (airline, flight_no, from_code, from_city, to_code, to_city, depart_at, kind) VALUES (?,?,?,?,?,?,?,?)`,
      [airline, flightNo, fromCode, fromCity, toCode, toCity, `${date}T${time}:00`, 'flight'],
    );
    router.back();
  };

  return (
    <DetailScreen title="Nouveau vol" onSave={save}>
      <Field label="Ville de départ" value={fromCity} onChange={setFromCity} placeholder="Tunis" />
      <Field label="Code aéroport départ" value={fromCode} onChange={setFromCode} placeholder="TUN" autoCapitalize="characters" />
      <Field label="Ville d'arrivée" value={toCity} onChange={setToCity} placeholder="Paris" />
      <Field label="Code aéroport arrivée" value={toCode} onChange={setToCode} placeholder="CDG" autoCapitalize="characters" />
      <Field label="Date (AAAA-MM-JJ)" value={date} onChange={setDate} placeholder="2026-06-23" />
      <Field label="Heure (HH:MM)" value={time} onChange={setTime} placeholder="10:00" />
      <Field label="Compagnie" value={airline} onChange={setAirline} placeholder="Air France" />
      <Field label="N° de vol" value={flightNo} onChange={setFlightNo} placeholder="AF1234" />
    </DetailScreen>
  );
}
