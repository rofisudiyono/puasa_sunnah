import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { normalizeLanguage } from '@/i18n';
import {
  getSelectableFastingTypes,
  requestNotificationPermission,
  syncFastingNotifications,
} from '@/utils/fastingNotifications';
import {
  getNotificationSettings,
  getNotificationTypeLabel,
  saveNotificationSettings,
  type FastingNotificationType,
  type NotificationSettings,
} from '@/utils/notificationSettings';

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

export default function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getNotificationSettings().then(setSettings);
  }, []);

  if (!settings) {
    return null;
  }

  const handleToggleGlobal = async (value: boolean) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      if (value) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          Alert.alert(t('notifications.permissionTitle'), t('notifications.permissionMessage'));
          setIsSaving(false);
          return;
        }
      }

      const nextSettings = { ...settings, enabled: value };
      setSettings(nextSettings);
      await saveNotificationSettings(nextSettings);
      await syncFastingNotifications(language);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleType = async (type: keyof NotificationSettings['types'], value: boolean) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const nextSettings = {
        ...settings,
        types: {
          ...settings.types,
          [type]: value,
        },
      };

      setSettings(nextSettings);
      await saveNotificationSettings(nextSettings);
      if (nextSettings.enabled) {
        await syncFastingNotifications(language);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.backText}>‹ {t('notifications.back')}</Text>
          </TouchableOpacity>
          <LanguageSwitcher compact />
        </View>
        <Text style={styles.title}>{t('notifications.title')}</Text>
        <Text style={styles.subtitle}>{t('notifications.description')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>{t('notifications.masterTitle')}</Text>
              <Text style={styles.rowText}>{t('notifications.masterDescription')}</Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggleGlobal}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={settings.enabled ? '#1B5E20' : '#F8FAFC'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('notifications.typesTitle')}</Text>
          <Text style={styles.sectionText}>{t('notifications.typesDescription')}</Text>

          {getSelectableFastingTypes().map((type: FastingNotificationType) => (
            <View key={type} style={styles.typeRow}>
              <View style={styles.typeTextWrap}>
                <Text style={styles.typeTitle}>{getNotificationTypeLabel(language, type)}</Text>
                <Text style={styles.typeSubtitle}>{t('notifications.remindAt')}</Text>
              </View>
              <Switch
                value={settings.types[type]}
                onValueChange={(value) => handleToggleType(type, value)}
                disabled={!settings.enabled}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={settings.types[type] ? '#1B5E20' : '#F8FAFC'}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  backButton: {
    paddingTop: 2,
  },
  backText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E8EB',
    padding: 16,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    color: '#173F27',
    fontSize: 16,
    fontWeight: '800',
  },
  rowText: {
    color: '#5E6A71',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#6C767D',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionText: {
    color: '#5E6A71',
    fontSize: 13,
    lineHeight: 20,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  typeTextWrap: {
    flex: 1,
  },
  typeTitle: {
    color: '#173F27',
    fontSize: 15,
    fontWeight: '700',
  },
  typeSubtitle: {
    color: '#5E6A71',
    fontSize: 12,
    marginTop: 2,
  },
});
