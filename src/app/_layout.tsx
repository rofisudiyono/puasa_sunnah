import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import i18n, { normalizeLanguage } from '@/i18n';
import {
  applyOtaUpdateIfAvailable,
  getAvailableStoreUpdate,
  getUpdateAlertCopy,
  openStoreForUpdate,
} from '@/utils/appUpdate';
import { syncFastingNotifications } from '@/utils/fastingNotifications';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

    syncFastingNotifications(language);

    if (Platform.OS === 'web') {
      return;
    }

    (async () => {
      const otaApplied = await applyOtaUpdateIfAvailable();
      if (otaApplied) {
        return;
      }

      const updateInfo = await getAvailableStoreUpdate();
      if (!updateInfo) {
        return;
      }

      const copy = getUpdateAlertCopy(language, updateInfo.latestVersion);

      Alert.alert(copy.title, copy.message, [
        {
          text: copy.later,
          style: 'cancel',
        },
        {
          text: copy.update,
          onPress: () => {
            openStoreForUpdate(updateInfo.storeUrl);
          },
        },
      ]);
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
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
        <Stack.Screen
          name="puasa-list"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
