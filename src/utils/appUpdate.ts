import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Linking, Platform } from 'react-native';

import type { AppLanguage } from '@/i18n';

interface UpdateInfo {
  latestVersion: string;
  storeUrl: string;
}

function normalizeVersion(version: string) {
  return version
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => !Number.isNaN(part));
}

function isRemoteVersionNewer(currentVersion: string, latestVersion: string) {
  const current = normalizeVersion(currentVersion);
  const latest = normalizeVersion(latestVersion);
  const maxLength = Math.max(current.length, latest.length);

  for (let index = 0; index < maxLength; index += 1) {
    const currentValue = current[index] ?? 0;
    const latestValue = latest[index] ?? 0;

    if (latestValue > currentValue) {
      return true;
    }

    if (latestValue < currentValue) {
      return false;
    }
  }

  return false;
}

async function fetchIosUpdateInfo(bundleId: string): Promise<UpdateInfo | null> {
  const response = await fetch(`https://itunes.apple.com/lookup?bundleId=${bundleId}`);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const result = data?.results?.[0];

  if (!result?.version || !result?.trackViewUrl) {
    return null;
  }

  return {
    latestVersion: String(result.version),
    storeUrl: String(result.trackViewUrl),
  };
}

async function fetchAndroidUpdateInfo(packageName: string): Promise<UpdateInfo | null> {
  const storeUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=en&gl=us`;
  const response = await fetch(storeUrl);
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const matchedVersion = html.match(/"softwareVersion":"([^"]+)"/)
    ?? html.match(/itemprop="softwareVersion">([^<]+)/);

  if (!matchedVersion?.[1]) {
    return null;
  }

  return {
    latestVersion: matchedVersion[1].trim(),
    storeUrl,
  };
}

export async function getAvailableStoreUpdate(): Promise<UpdateInfo | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const currentVersion = Constants.expoConfig?.version;
  if (!currentVersion) {
    return null;
  }

  try {
    if (Platform.OS === 'ios') {
      const bundleId = Constants.expoConfig?.ios?.bundleIdentifier;
      if (!bundleId) {
        return null;
      }

      const info = await fetchIosUpdateInfo(bundleId);
      if (info && isRemoteVersionNewer(currentVersion, info.latestVersion)) {
        return info;
      }

      return null;
    }

    if (Platform.OS === 'android') {
      const packageName = Constants.expoConfig?.android?.package;
      if (!packageName) {
        return null;
      }

      const info = await fetchAndroidUpdateInfo(packageName);
      if (info && isRemoteVersionNewer(currentVersion, info.latestVersion)) {
        return info;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function applyOtaUpdateIfAvailable() {
  if (Platform.OS === 'web' || !Updates.isEnabled) {
    return false;
  }

  try {
    const updateResult = await Updates.checkForUpdateAsync();
    if (!updateResult.isAvailable) {
      return false;
    }

    const fetchResult = await Updates.fetchUpdateAsync();
    if (fetchResult.isNew) {
      await Updates.reloadAsync();
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function openStoreForUpdate(url: string) {
  await Linking.openURL(url);
}

export function getUpdateAlertCopy(language: AppLanguage, latestVersion: string) {
  if (language === 'id') {
    return {
      title: 'Update Tersedia',
      message: `Versi terbaru (${latestVersion}) sudah tersedia di store. Silakan update aplikasi untuk mendapatkan perbaikan dan fitur terbaru.`,
      later: 'Nanti',
      update: 'Update',
    };
  }

  return {
    title: 'Update Available',
    message: `A newer version (${latestVersion}) is available on the store. Please update the app to get the latest fixes and features.`,
    later: 'Later',
    update: 'Update',
  };
}
