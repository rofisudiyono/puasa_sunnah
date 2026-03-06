import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { translatePuasaItem } from '@/utils/translatePuasa';
import type { FadilahItem, PuasaItem } from '@/utils/puasaSunnah';

interface DetailPuasaScreenProps {
  puasa?: PuasaItem;
  onBack: () => void;
}

interface SectionTitleProps {
  title: string;
  color: string;
}

interface FadilahCardProps {
  index: number;
  item: FadilahItem;
  color: string;
}

export default function DetailPuasaScreen({ puasa, onBack }: DetailPuasaScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  if (!puasa) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyTitle}>{t('detail.notFound')}</Text>
        <TouchableOpacity style={styles.emptyBackButton} onPress={onBack}>
          <Text style={styles.emptyBackText}>{t('detail.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const localizedPuasa = translatePuasaItem(t, puasa);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📿 ${localizedPuasa.nama}\n\n${localizedPuasa.deskripsiSingkat}\n\n🌙 Niat:\n${localizedPuasa.niatLatin}\n\n${t('detail.meaningLabel')} "${localizedPuasa.niatArtinya}"\n\n${t('detail.shareTitle')}:\n${localizedPuasa.fadilah
          .map((f, i) => `${i + 1}. ${f.judul}\n${f.isi}\n(${f.sumber})`)
          .join('\n\n')}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={localizedPuasa.color} />

      <View
        style={[
          styles.header,
          { backgroundColor: localizedPuasa.color, paddingTop: insets.top + 10 },
        ]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>‹ {t('detail.back')}</Text>
          </TouchableOpacity>
          <LanguageSwitcher />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>{localizedPuasa.icon}</Text>
          <Text style={styles.headerTitle}>{localizedPuasa.nama}</Text>
          <Text style={styles.headerArabic}>{localizedPuasa.arabicName}</Text>
          <View style={styles.kategoriPill}>
            <Text style={styles.kategoriText}>{localizedPuasa.kategori}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.descCard}>
          <Text style={styles.descText}>{localizedPuasa.deskripsiSingkat}</Text>
        </View>

        {localizedPuasa.infoBulanan && localizedPuasa.infoBulanan.length > 0 ? (
          <>
            <SectionTitle title={t('detail.monthlyInfoSection')} color={localizedPuasa.color} />
            <View style={styles.infoCard}>
              {localizedPuasa.infoBulanan.map((item, index) => (
                <View key={`${localizedPuasa.id}-info-${index}`} style={styles.infoRow}>
                  <Text style={[styles.infoBullet, { color: localizedPuasa.color }]}>•</Text>
                  <Text style={styles.infoText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <SectionTitle title={t('detail.virtueSection')} color={localizedPuasa.color} />

        {localizedPuasa.fadilah.map((item, idx) => (
          <FadilahCard
            key={`${item.judul}-${idx}`}
            index={idx + 1}
            item={item}
            color={localizedPuasa.color}
          />
        ))}

        <SectionTitle title={t('detail.niatSection')} color={localizedPuasa.color} />

        <View style={styles.niatCard}>
          <Text style={styles.niatArab}>{localizedPuasa.niat}</Text>
          <View style={styles.divider} />
          <Text style={styles.niatLatin}>{localizedPuasa.niatLatin}</Text>
          <View style={styles.divider} />
          <Text style={styles.niatLabel}>{t('detail.meaningLabel')}</Text>
          <Text style={styles.niatArti}>"{localizedPuasa.niatArtinya}"</Text>
        </View>

        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: localizedPuasa.color }]}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Text style={styles.shareText}>{t('detail.shareButton')}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, color }: SectionTitleProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionAccent, { backgroundColor: color }]} />
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

function FadilahCard({ index, item, color }: FadilahCardProps) {
  return (
    <View style={styles.fadilahCard}>
      <View style={[styles.fadilahIndex, { backgroundColor: color + '20', borderColor: color }]}>
        <Text style={[styles.fadilahIndexText, { color }]}>{index}</Text>
      </View>
      <View style={styles.fadilahBody}>
        <Text style={styles.fadilahJudul}>{item.judul}</Text>
        <Text style={styles.fadilahIsi}>{item.isi}</Text>
        <View style={[styles.sumberPill, { borderColor: color + '40' }]}>
          <Text style={[styles.sumberText, { color }]}>📚 {item.sumber}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#F7F7F7',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  emptyBackButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBackText: {
    color: '#fff',
    fontWeight: '600',
  },
  root: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 10,
  },
  backButton: {
    marginBottom: 0,
    paddingTop: 2,
  },
  backText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerArabic: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    textAlign: 'center',
  },
  kategoriPill: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  kategoriText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  descCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  descText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoBullet: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#47545D',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  fadilahCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    gap: 12,
  },
  fadilahIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  fadilahIndexText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fadilahBody: {
    flex: 1,
  },
  fadilahJudul: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6,
  },
  fadilahIsi: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  sumberPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  sumberText: {
    fontSize: 11,
    fontWeight: '600',
  },
  niatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  niatArab: {
    fontSize: 20,
    textAlign: 'right',
    color: '#1a1a1a',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
    lineHeight: 36,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
  },
  niatLatin: {
    fontSize: 14,
    color: '#424242',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 14,
    textAlign: 'center',
  },
  niatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  niatArti: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  shareButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  shareText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
