import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function setupPuasaReminder(hour = 3, minute = 30) {
  const granted = await requestNotificationPermission();

  if (!granted) {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('puasa-reminder', {
      name: 'Puasa Reminder',
      importance: Notifications.AndroidImportance.HIGH,
      sound: null,
      vibrationPattern: [250, 250],
    });
  }

  const trigger = {
    hour,
    minute,
    repeats: true,
  };

  if (Platform.OS === 'android') {
    trigger.channelId = 'puasa-reminder';
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pengingat Puasa Sunnah',
      body: 'Periksa kalender hari ini. Mungkin ada puasa sunnah yang dianjurkan.',
    },
    trigger,
  });
}

export async function cancelAllPuasaReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
