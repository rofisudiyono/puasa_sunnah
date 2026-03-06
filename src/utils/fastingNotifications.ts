import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import moment from 'moment-hijri';
import { Platform } from 'react-native';

import type { AppLanguage } from '@/i18n';
import {
  FASTING_NOTIFICATION_TYPES,
  getNotificationSettings,
  getNotificationTypeLabel,
  getScheduledNotificationIds,
  saveScheduledNotificationIds,
  type FastingNotificationType,
} from '@/utils/notificationSettings';
import { getPuasaOnDate, type PuasaItem } from '@/utils/puasaSunnah';

const NOTIFICATION_HOUR = 19;
const SCHEDULE_DAYS_AHEAD = 365;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function isNativeNotificationsSupported() {
  return Platform.OS === 'android' || Platform.OS === 'ios';
}

export async function configureNotificationChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('fasting-reminders', {
    name: 'Fasting Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 200, 200],
    lightColor: '#1B5E20',
  });
}

export async function getNotificationPermissionStatus() {
  if (!isNativeNotificationsSupported()) {
    return 'unsupported' as const;
  }

  const permissions = await Notifications.getPermissionsAsync();
  return permissions.status;
}

export async function requestNotificationPermission() {
  if (!isNativeNotificationsSupported() || !Device.isDevice) {
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

function getEnabledItemsForDate(dateString: string, enabledTypes: Record<FastingNotificationType, boolean>) {
  return getPuasaOnDate(dateString).filter((item) => enabledTypes[item.id as FastingNotificationType]);
}

function createNotificationContent(
  language: AppLanguage,
  fastingDate: string,
  items: PuasaItem[],
) {
  const localizedNames = items.map((item) => getNotificationTypeLabel(language, item.id as FastingNotificationType));
  const fastingDay = moment(fastingDate).locale(language);
  const formattedDate = language === 'id'
    ? fastingDay.format('dddd, D MMMM YYYY')
    : fastingDay.format('dddd, MMMM D, YYYY');

  if (language === 'id') {
    return {
      title: 'Pengingat Puasa Besok',
      body: localizedNames.length === 1
        ? `Besok ${formattedDate} ada ${localizedNames[0]}. Persiapkan niat puasa dari malam ini.`
        : `Besok ${formattedDate} ada ${localizedNames.join(', ')}. Persiapkan niat puasa dari malam ini.`,
    };
  }

  return {
    title: 'Tomorrow Fasting Reminder',
    body: localizedNames.length === 1
      ? `Tomorrow, ${formattedDate}, is ${localizedNames[0]}. Prepare your intention tonight.`
      : `Tomorrow, ${formattedDate}, includes ${localizedNames.join(', ')}. Prepare your intention tonight.`,
  };
}

async function cancelManagedNotifications() {
  const ids = await getScheduledNotificationIds();

  await Promise.all(ids.map(async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // Ignore stale identifiers from previous schedules.
    }
  }));

  await saveScheduledNotificationIds([]);
}

export async function syncFastingNotifications(language: AppLanguage, options?: { requestPermission?: boolean }) {
  if (!isNativeNotificationsSupported()) {
    return;
  }

  await configureNotificationChannel();

  const settings = await getNotificationSettings();

  if (!settings.enabled) {
    await cancelManagedNotifications();
    return;
  }

  const permissionGranted = options?.requestPermission
    ? await requestNotificationPermission()
    : (await Notifications.getPermissionsAsync()).granted;

  if (!permissionGranted) {
    return;
  }

  await cancelManagedNotifications();

  const scheduledIds: string[] = [];
  const today = moment().startOf('day');

  for (let offset = 1; offset <= SCHEDULE_DAYS_AHEAD; offset += 1) {
    const fastingDate = today.clone().add(offset, 'day').format('YYYY-MM-DD');
    const enabledItems = getEnabledItemsForDate(fastingDate, settings.types);

    if (enabledItems.length === 0) {
      continue;
    }

    const triggerDate = today.clone().add(offset - 1, 'day').hour(NOTIFICATION_HOUR).minute(0).second(0).millisecond(0);

    if (triggerDate.toDate().getTime() <= Date.now()) {
      continue;
    }

    const content = createNotificationContent(language, fastingDate, enabledItems);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        sound: true,
        data: {
          source: 'fasting-reminder',
          fastingDate,
          fastingTypes: enabledItems.map((item) => item.id),
        },
      },
      trigger: triggerDate.toDate(),
    });

    scheduledIds.push(id);
  }

  await saveScheduledNotificationIds(scheduledIds);
}

export function getSelectableFastingTypes() {
  return FASTING_NOTIFICATION_TYPES;
}
