import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppLanguage } from '@/i18n';
import { PUASA_DATA } from '@/utils/puasaSunnah';

const SETTINGS_STORAGE_KEY = 'fasting_notification_settings_v1';
const NOTIFICATION_IDS_STORAGE_KEY = 'fasting_notification_ids_v1';

export type FastingNotificationType = keyof typeof PUASA_DATA;

export interface NotificationSettings {
  enabled: boolean;
  types: Record<FastingNotificationType, boolean>;
}

export const FASTING_NOTIFICATION_TYPES = Object.keys(PUASA_DATA) as FastingNotificationType[];

export function createDefaultNotificationSettings(): NotificationSettings {
  return {
    enabled: false,
    types: FASTING_NOTIFICATION_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: false }),
      {} as Record<FastingNotificationType, boolean>,
    ),
  };
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return createDefaultNotificationSettings();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
    const defaults = createDefaultNotificationSettings();

    return {
      enabled: parsed.enabled ?? defaults.enabled,
      types: FASTING_NOTIFICATION_TYPES.reduce(
        (acc, type) => ({
          ...acc,
          [type]: parsed.types?.[type] ?? defaults.types[type],
        }),
        {} as Record<FastingNotificationType, boolean>,
      ),
    };
  } catch {
    return createDefaultNotificationSettings();
  }
}

export async function saveNotificationSettings(settings: NotificationSettings) {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export async function getScheduledNotificationIds() {
  const raw = await AsyncStorage.getItem(NOTIFICATION_IDS_STORAGE_KEY);
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [] as string[];
  }
}

export async function saveScheduledNotificationIds(ids: string[]) {
  await AsyncStorage.setItem(NOTIFICATION_IDS_STORAGE_KEY, JSON.stringify(ids));
}

export function getNotificationTypeLabel(language: AppLanguage, type: FastingNotificationType) {
  const labels: Record<AppLanguage, Record<FastingNotificationType, string>> = {
    id: {
      ramadhan: 'Puasa Ramadhan',
      senin_kamis: 'Puasa Senin & Kamis',
      ayyamul_bidh: 'Ayyamul Bidh',
      arafah: 'Puasa Arafah',
      tasua: "Puasa Tasu'a",
      asyura: 'Puasa Asyura',
      syawal: 'Puasa Syawal',
      rajab: 'Puasa Rajab',
      syaban: "Puasa Sya'ban",
      nisfu_syaban: "Puasa Nisfu Sya'ban",
      dzulhijjah: 'Puasa Dzulhijjah',
    },
    en: {
      ramadhan: 'Ramadan Fasting',
      senin_kamis: 'Monday & Thursday Fasting',
      ayyamul_bidh: 'Ayyamul Bidh',
      arafah: 'Arafah Fasting',
      tasua: "Tasu'a Fasting",
      asyura: 'Ashura Fasting',
      syawal: 'Shawwal Fasting',
      rajab: 'Rajab Fasting',
      syaban: "Sha'ban Fasting",
      nisfu_syaban: "Nisfu Sha'ban Fasting",
      dzulhijjah: 'Dhul Hijjah Fasting',
    },
  };

  return labels[language][type];
}
