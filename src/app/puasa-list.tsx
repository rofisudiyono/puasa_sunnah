import { useRouter } from 'expo-router';
import React from 'react';

import PuasaListScreen from '@/screens/PuasaListScreen';

export default function PuasaListRoute() {
  const router = useRouter();

  return <PuasaListScreen onBack={() => router.back()} />;
}
