import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment-hijri';
import 'moment/locale/id';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import HijriDayComponent, { type CalendarDateCell } from '@/components/HijriDayComponent';
import { normalizeLanguage } from '@/i18n';
import { translatePuasaItem } from '@/utils/translatePuasa';
import {
  type CalendarMarking,
  generateMarkedDates,
  getPuasaOnDate,
  getHijriInfo,
} from '@/utils/puasaSunnah';

LocaleConfig.locales.id = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: 'Hari Ini',
};

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

interface CalendarMonth {
  year: number;
  month: number;
}

interface LegendItem {
  id: string;
  color: string;
  labelKey: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { id: 'senin_kamis', color: '#4CAF50', labelKey: 'calendar.legend.seninKamis' },
  { id: 'ayyamul_bidh', color: '#2196F3', labelKey: 'calendar.legend.ayyamulBidh' },
  { id: 'arafah', color: '#FF9800', labelKey: 'calendar.legend.arafah' },
  { id: 'tasua', color: '#9C27B0', labelKey: 'calendar.legend.tasua' },
  { id: 'asyura', color: '#673AB7', labelKey: 'calendar.legend.asyura' },
  { id: 'syawal', color: '#00BCD4', labelKey: 'calendar.legend.syawal' },
  { id: 'syaban', color: '#FF5722', labelKey: 'calendar.legend.syaban' },
  { id: 'nisfu_syaban', color: '#FF7043', labelKey: 'calendar.legend.nisfuSyaban' },
  { id: 'dzulhijjah', color: '#FFC107', labelKey: 'calendar.legend.dzulhijjah' },
  { id: 'rajab', color: '#E91E63', labelKey: 'calendar.legend.rajab' },
];

export default function CalendarScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const today = moment().format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState(today);
  const [markedDates, setMarkedDates] = useState<Record<string, CalendarMarking>>({});
  const [currentMonth, setCurrentMonth] = useState({
    year: moment().year(),
    month: moment().month() + 1,
  });

  useEffect(() => {
    moment.locale(language);
    LocaleConfig.defaultLocale = language;
  }, [language]);

  const buildMarked = useCallback(() => {
    const marked = generateMarkedDates(currentMonth.year, currentMonth.month);

    const existing = marked[selectedDate];
    marked[selectedDate] = {
      ...(existing || { dots: [], marked: true }),
      selected: true,
      selectedColor: 'transparent',
    };

    setMarkedDates(marked);
  }, [currentMonth, selectedDate]);

  useEffect(() => {
    buildMarked();
  }, [buildMarked]);

  const handleDayPress = (date: CalendarDateCell) => {
    setSelectedDate(date.dateString);
  };

  const handleMonthChange = (month: CalendarMonth) => {
    setCurrentMonth({ year: month.year, month: month.month });
  };

  const puasaHariIni = useMemo(
    () => getPuasaOnDate(selectedDate).map((item) => translatePuasaItem(t, item)),
    [selectedDate, t],
  );
  const visibleLegends = useMemo(() => {
    const activeLegendIds = new Set<string>();
    Object.values(markedDates).forEach((dateMarking) => {
      dateMarking.dots.forEach((dot) => activeLegendIds.add(dot.key));
    });

    return LEGEND_ITEMS.filter((item) => activeLegendIds.has(item.id));
  }, [markedDates]);

  const hijri = getHijriInfo(selectedDate, language);
  const formattedDate = moment(selectedDate).locale(language).format('dddd, D MMMM YYYY');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
          <LanguageSwitcher />
        </View>
        <Text style={styles.headerSubtitle}>{hijri.fullDate}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarWrapper}>
          <Calendar
            current={today}
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            dayComponent={(props: any) => (
              <HijriDayComponent
                {...props}
                language={language}
                onPress={handleDayPress}
              />
            )}
            theme={{
              backgroundColor: '#fff',
              calendarBackground: '#fff',
              textSectionTitleColor: '#4CAF50',
              monthTextColor: '#1B5E20',
              textMonthFontWeight: '700',
              textMonthFontSize: 16,
              arrowColor: '#4CAF50',
              textDayHeaderFontSize: 11,
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        <LegendSection legends={visibleLegends} />

        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailDate}>{formattedDate}</Text>
            <Text style={styles.detailHijri}>{hijri.fullDate}</Text>
          </View>

          {puasaHariIni.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>☀️</Text>
              <Text style={styles.emptyText}>{t('calendar.empty')}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>
                {t('calendar.availableFastings', { count: puasaHariIni.length })}
              </Text>
              {puasaHariIni.map((puasa) => (
                <TouchableOpacity
                  key={puasa.id}
                  style={styles.puasaCard}
                  onPress={() => router.push({ pathname: '/detail-puasa', params: { id: puasa.id } })}
                  activeOpacity={0.75}
                >
                  <View style={[styles.puasaColorBar, { backgroundColor: puasa.color }]} />
                  <View style={styles.puasaContent}>
                    <View style={styles.puasaTop}>
                      <Text style={styles.puasaIcon}>{puasa.icon}</Text>
                      <View style={styles.puasaTextGroup}>
                        <Text style={styles.puasaNama}>{puasa.nama}</Text>
                        <Text style={styles.puasaKategori}>{puasa.kategori}</Text>
                      </View>
                    </View>
                    <Text style={styles.puasaDeskripsi} numberOfLines={2}>
                      {puasa.deskripsiSingkat}
                    </Text>
                  </View>
                  <View style={styles.puasaArrow}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

interface LegendSectionProps {
  legends: LegendItem[];
}

function LegendSection({ legends }: LegendSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.legendSection}>
      <Text style={styles.legendTitle}>{t('calendar.legendTitle')}</Text>
      <View style={styles.legendGrid}>
        {legends.map((item) => (
          <View key={item.labelKey} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{t(item.labelKey)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: Platform.OS === 'android' ? 16 : 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A5D6A7',
    marginTop: 8,
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  legendSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5E6A71',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    columnGap: 8,
  },
  legendItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  legendLabel: {
    flexShrink: 1,
    fontSize: 13,
    color: '#40505A',
    fontWeight: '500',
  },
  detailSection: {
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 20,
  },
  detailHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 14,
  },
  detailDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  detailHijri: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  puasaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  puasaColorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  puasaContent: {
    flex: 1,
    padding: 14,
  },
  puasaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  puasaIcon: {
    fontSize: 22,
  },
  puasaTextGroup: {
    flex: 1,
  },
  puasaNama: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  puasaKategori: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  puasaDeskripsi: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 17,
  },
  puasaArrow: {
    paddingRight: 14,
  },
  arrowText: {
    fontSize: 24,
    color: '#BDBDBD',
    fontWeight: '300',
  },
});
