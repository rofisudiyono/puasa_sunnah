import { useRouter } from 'expo-router';
import React from 'react';

import PrivacyPolicyScreen from '@/screens/PrivacyPolicyScreen';

export default function PrivacyPolicyRoute() {
  const router = useRouter();

  return <PrivacyPolicyScreen onBack={() => router.back()} />;
}
