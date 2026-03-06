import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import i18n, { normalizeLanguage } from '@/i18n';
import { syncFastingNotifications } from '@/utils/fastingNotifications';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    syncFastingNotifications(normalizeLanguage(i18n.resolvedLanguage ?? i18n.language));
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="about"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="detail-puasa"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="notification-settings"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
