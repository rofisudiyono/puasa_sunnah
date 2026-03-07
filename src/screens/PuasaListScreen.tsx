import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
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
import { translatePuasaItem } from '@/utils/translatePuasa';
import { PUASA_DATA } from '@/utils/puasaSunnah';

interface PuasaListScreenProps {
  onBack: () => void;
}

export default function PuasaListScreen({ onBack }: PuasaListScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const items = useMemo(
    () => Object.values(PUASA_DATA).map((item) => translatePuasaItem(t, item)),
    [t],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
            <Text style={styles.backText}>‹ {t('listPuasa.back')}</Text>
          </TouchableOpacity>
          <LanguageSwitcher compact />
        </View>
        <Text style={styles.title}>{t('listPuasa.title')}</Text>
        <Text style={styles.subtitle}>{t('listPuasa.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/detail-puasa', params: { id: item.id } })}
            activeOpacity={0.82}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${item.color}18` }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.nama}</Text>
                <View style={[styles.categoryPill, { borderColor: `${item.color}55` }]}>
                  <Text style={[styles.categoryText, { color: item.color }]}>{item.kategori}</Text>
                </View>
              </View>
              <Text style={styles.cardArabic}>{item.arabicName}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.deskripsiSingkat}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
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
    paddingBottom: 18,
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
    marginTop: 4,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3E7EA',
    padding: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTop: {
    gap: 6,
  },
  cardTitle: {
    color: '#173F27',
    fontSize: 16,
    fontWeight: '700',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardArabic: {
    color: '#6C767D',
    fontSize: 13,
  },
  cardDescription: {
    color: '#47545D',
    fontSize: 13,
    lineHeight: 19,
  },
  arrow: {
    color: '#91A09A',
    fontSize: 24,
  },
});
