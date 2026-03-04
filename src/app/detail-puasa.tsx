import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import DetailPuasaScreen from '@/screens/DetailPuasaScreen';
import { getPuasaById } from '@/utils/puasaSunnah';

export default function DetailPuasaRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const puasa = id ? getPuasaById(id) : undefined;

  return <DetailPuasaScreen puasa={puasa} onBack={() => router.back()} />;
}
