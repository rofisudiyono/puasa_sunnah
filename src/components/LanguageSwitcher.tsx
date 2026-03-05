import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { normalizeLanguage, type AppLanguage } from '@/i18n';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const switchLanguage = async (language: AppLanguage) => {
    if (activeLanguage === language) {
      return;
    }

    await i18n.changeLanguage(language);
  };

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {!compact && <Text style={styles.label}>{t('common.language')}</Text>}
      <View style={[styles.segmentedControl, compact && styles.segmentedControlCompact]}>
        {(['id', 'en'] as AppLanguage[]).map((language) => {
          const isActive = activeLanguage === language;

          return (
            <Pressable
              key={language}
              style={[
                styles.optionButton,
                compact && styles.optionButtonCompact,
                isActive && styles.optionButtonActive,
              ]}
              onPress={() => switchLanguage(language)}>
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {language.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    gap: 4,
  },
  containerCompact: {
    gap: 0,
  },
  label: {
    color: '#E8F5E9',
    fontSize: 11,
    fontWeight: '600',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    padding: 2,
  },
  segmentedControlCompact: {
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  optionButton: {
    minWidth: 42,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  optionButtonCompact: {
    minWidth: 38,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  optionButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    color: '#F1F5F9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionTextActive: {
    color: '#1B5E20',
  },
});
