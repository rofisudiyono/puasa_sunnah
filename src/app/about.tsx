import { useRouter } from 'expo-router';
import React from 'react';

import AboutScreen from '@/screens/AboutScreen';

export default function AboutRoute() {
  const router = useRouter();

  return <AboutScreen onBack={() => router.back()} />;
}
