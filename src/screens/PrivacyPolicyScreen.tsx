import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageSwitcher from '@/components/LanguageSwitcher';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const SECTION_KEYS = [
  'introduction',
  'dataCollection',
  'dataUsage',
  'dataStorage',
  'thirdParty',
  'children',
  'changes',
  'contact',
] as const;

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.backText}>‹ {t('privacy.back')}</Text>
          </TouchableOpacity>
          <LanguageSwitcher compact />
        </View>
        <Text style={styles.title}>{t('privacy.title')}</Text>
        <Text style={styles.subtitle}>{t('privacy.lastUpdated')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTION_KEYS.map((key) => (
          <View key={key} style={styles.card}>
            <Text style={styles.sectionTitle}>{t(`privacy.sections.${key}.title`)}</Text>
            <Text style={styles.description}>{t(`privacy.sections.${key}.body`)}</Text>
          </View>
        ))}
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
    color: '#173F27',
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    color: '#47545D',
    fontSize: 14,
    lineHeight: 22,
  },
});
