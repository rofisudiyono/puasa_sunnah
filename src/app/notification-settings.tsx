import { useRouter } from 'expo-router';
import React from 'react';

import NotificationSettingsScreen from '@/screens/NotificationSettingsScreen';

export default function NotificationSettingsRoute() {
  const router = useRouter();

  return <NotificationSettingsScreen onBack={() => router.back()} />;
}
