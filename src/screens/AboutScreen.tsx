import Constants from 'expo-constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageSwitcher from '@/components/LanguageSwitcher';

const DEVELOPER_EMAIL = 'arashy.sc@gmail.com';

interface AboutScreenProps {
  onBack: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenNotificationSettings: () => void;
}

export default function AboutScreen({
  onBack,
  onOpenPrivacyPolicy,
  onOpenNotificationSettings,
}: AboutScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleSendSuggestion = async () => {
    const mailtoUrl = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(t('about.emailSubject'))}&body=${encodeURIComponent(t('about.emailBody'))}`;

    try {
      await Linking.openURL(mailtoUrl);
    } catch {
      Alert.alert(t('about.emailErrorTitle'), t('about.emailErrorMessage'));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.backText}>‹ {t('about.back')}</Text>
          </TouchableOpacity>
          <LanguageSwitcher compact />
        </View>
        <Text style={styles.title}>{t('about.title')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.sectionApp')}</Text>
          <Text style={styles.appName}>{t('about.appName')}</Text>
          <Text style={styles.version}>{t('about.versionLabel', { version: appVersion })}</Text>
          <Text style={styles.description}>{t('about.description')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.sectionSuggestion')}</Text>
          <Text style={styles.description}>{t('about.suggestionDescription')}</Text>
          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>{t('about.emailLabel')}</Text>
            <Text style={styles.emailValue}>{DEVELOPER_EMAIL}</Text>
          </View>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleSendSuggestion}
            activeOpacity={0.85}
          >
            <Text style={styles.emailButtonText}>{t('about.sendSuggestionButton')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.sectionNotification')}</Text>
          <Text style={styles.description}>{t('about.notificationDescription')}</Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onOpenNotificationSettings}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>{t('about.notificationButton')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.sectionLegal')}</Text>
          <Text style={styles.description}>{t('about.privacyDescription')}</Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onOpenPrivacyPolicy}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>{t('about.privacyButton')}</Text>
          </TouchableOpacity>
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
    gap: 8,
  },
  sectionTitle: {
    color: '#6C767D',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  appName: {
    color: '#173F27',
    fontSize: 22,
    fontWeight: '800',
  },
  version: {
    color: '#5E6A71',
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    color: '#47545D',
    fontSize: 14,
    lineHeight: 21,
  },
  emailBox: {
    marginTop: 6,
    backgroundColor: '#F0F7F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D8EAD9',
    gap: 2,
  },
  emailLabel: {
    color: '#4C6852',
    fontSize: 12,
    fontWeight: '600',
  },
  emailValue: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: '700',
  },
  emailButton: {
    marginTop: 12,
    backgroundColor: '#1B5E20',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: '#F0F7F1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8EAD9',
  },
  secondaryButtonText: {
    color: '#1B5E20',
    fontSize: 14,
    fontWeight: '700',
  },
});
