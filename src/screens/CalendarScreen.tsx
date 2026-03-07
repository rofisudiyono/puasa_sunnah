import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

interface CompactCalendarProps {
  language: 'id' | 'en';
  selectedDate: string;
  startDate: string;
  onDayPress: (date: CalendarDateCell) => void;
  onPrevious: () => void;
  onNext: () => void;
  onExpand: () => void;
  markedDates: Record<string, CalendarMarking>;
  t: (key: string) => string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { id: 'ramadhan', color: '#16A34A', labelKey: 'calendar.legend.ramadhan' },
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

function getCompactRangeStart(dateString: string) {
  return moment(dateString).day(0).format('YYYY-MM-DD');
}

function createDateCell(dateString: string): CalendarDateCell {
  const date = moment(dateString);
  return {
    dateString,
    day: date.date(),
    month: date.month() + 1,
    year: date.year(),
  };
}

function buildMarkedDatesForRange(dateStrings: string[], selectedDate: string) {
  const marks: Record<string, CalendarMarking> = {};

  dateStrings.forEach((dateString) => {
    const puasaList = getPuasaOnDate(dateString);
    const seen = new Set<string>();
    const dots = puasaList
      .filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      })
      .slice(0, 3)
      .map((p) => ({ key: p.id, color: p.dotColor }));

    if (dots.length > 0 || dateString === selectedDate) {
      marks[dateString] = {
        dots,
        marked: true,
        ...(dateString === selectedDate ? { selected: true, selectedColor: 'transparent' } : {}),
      };
    }
  });

  return marks;
}

function CompactCalendar({
  language,
  selectedDate,
  startDate,
  onDayPress,
  onPrevious,
  onNext,
  onExpand,
  markedDates,
  t,
}: CompactCalendarProps) {
  const start = moment(startDate);
  const days = Array.from({ length: 14 }, (_, index) => {
    const value = start.clone().add(index, 'day');
    return createDateCell(value.format('YYYY-MM-DD'));
  });
  const weeks = [days.slice(0, 7), days.slice(7, 14)];
  const end = start.clone().add(13, 'day');
  const sameMonth = start.month() === end.month() && start.year() === end.year();
  const title = sameMonth
    ? start.locale(language).format('MMMM YYYY')
    : `${start.locale(language).format('D MMM')} - ${end.locale(language).format('D MMM YYYY')}`;
  const weekdayLabels = (LocaleConfig.locales[language].dayNamesShort as string[]).map((label) => label.toUpperCase());

  return (
    <View style={styles.compactCalendar}>
      <View style={styles.compactHeader}>
        <View>
          <Text style={styles.compactTitle}>{title}</Text>
          <Text style={styles.compactSubtitle}>{t('calendar.compactLabel')}</Text>
        </View>
        <TouchableOpacity style={styles.compactToggleButton} onPress={onExpand} activeOpacity={0.8}>
          <Text style={styles.compactToggleText}>{t('calendar.showAllMonth')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.compactNavRow}>
        <TouchableOpacity style={styles.compactNavButton} onPress={onPrevious} activeOpacity={0.8}>
          <Text style={styles.compactNavText}>‹ {t('calendar.prevTwoWeeks')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.compactNavButton} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.compactNavText}>{t('calendar.nextTwoWeeks')} ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.compactWeekdayRow}>
        {weekdayLabels.map((label: string) => (
          <Text key={label} style={styles.compactWeekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, index) => (
        <View key={`compact-week-${index}`} style={styles.compactWeekRow}>
          {week.map((date) => (
            <View key={date.dateString} style={styles.compactDayCell}>
              <HijriDayComponent
                date={date}
                state={date.dateString === moment().format('YYYY-MM-DD') ? 'today' : undefined}
                marking={markedDates[date.dateString]}
                language={language}
                onPress={onDayPress}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function CalendarScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const today = moment().format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState(today);
  const [markedDates, setMarkedDates] = useState<Record<string, CalendarMarking>>({});
  const [isCompactCalendar, setIsCompactCalendar] = useState(true);
  const [compactStartDate, setCompactStartDate] = useState(getCompactRangeStart(today));
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
    setCurrentMonth({
      year: moment(date.dateString).year(),
      month: moment(date.dateString).month() + 1,
    });
  };

  const handleMonthChange = (month: CalendarMonth) => {
    setCurrentMonth({ year: month.year, month: month.month });
  };

  const puasaHariIni = useMemo(
    () => getPuasaOnDate(selectedDate).map((item) => translatePuasaItem(t, item)),
    [selectedDate, t],
  );
  const compactMarkedDates = useMemo(() => {
    const rangeDateStrings = Array.from({ length: 14 }, (_, index) => (
      moment(compactStartDate).add(index, 'day').format('YYYY-MM-DD')
    ));

    return buildMarkedDatesForRange(rangeDateStrings, selectedDate);
  }, [compactStartDate, selectedDate]);
  const visibleMarkedDates = isCompactCalendar ? compactMarkedDates : markedDates;
  const visibleLegends = useMemo(() => {
    const activeLegendIds = new Set<string>();
    Object.values(visibleMarkedDates).forEach((dateMarking) => {
      dateMarking.dots.forEach((dot) => activeLegendIds.add(dot.key));
    });

    return LEGEND_ITEMS.filter((item) => activeLegendIds.has(item.id));
  }, [visibleMarkedDates]);

  const hijri = getHijriInfo(selectedDate, language);
  const formattedDate = moment(selectedDate).locale(language).format('dddd, D MMMM YYYY');

  const handleToggleCalendarMode = () => {
    if (isCompactCalendar) {
      setCurrentMonth({
        year: moment(selectedDate).year(),
        month: moment(selectedDate).month() + 1,
      });
      setIsCompactCalendar(false);
      return;
    }

    setCompactStartDate(getCompactRangeStart(selectedDate));
    setIsCompactCalendar(true);
  };

  const handleCompactShift = (direction: -1 | 1) => {
    const nextStart = moment(compactStartDate).add(direction * 14, 'day');
    const nextSelectedDate = nextStart.format('YYYY-MM-DD');

    setCompactStartDate(nextSelectedDate);
    setSelectedDate(nextSelectedDate);
    setCurrentMonth({
      year: nextStart.year(),
      month: nextStart.month() + 1,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
          <View style={styles.headerActions}>
            <LanguageSwitcher compact />
          </View>
        </View>
        <Text style={styles.headerSubtitle}>{hijri.fullDate}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.learnCard}
          onPress={() => router.push('/puasa-list')}
          activeOpacity={0.86}
        >
          <View style={styles.learnCardText}>
            <Text style={styles.learnEyebrow}>{t('calendar.learnEyebrow')}</Text>
            <Text style={styles.learnTitle}>{t('calendar.learnTitle')}</Text>
            <Text style={styles.learnDescription}>{t('calendar.learnDescription')}</Text>
          </View>
          <View style={styles.learnArrowWrap}>
            <Text style={styles.learnArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.calendarWrapper}>
          {isCompactCalendar ? (
            <CompactCalendar
              language={language}
              selectedDate={selectedDate}
              startDate={compactStartDate}
              onDayPress={handleDayPress}
              onPrevious={() => handleCompactShift(-1)}
              onNext={() => handleCompactShift(1)}
              onExpand={handleToggleCalendarMode}
              markedDates={compactMarkedDates}
              t={t}
            />
          ) : (
            <>
              <View style={styles.fullMonthHeader}>
                <Text style={styles.fullMonthTitle}>{t('calendar.fullMonthLabel')}</Text>
                <TouchableOpacity
                  style={styles.fullMonthToggle}
                  onPress={handleToggleCalendarMode}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fullMonthToggleText}>{t('calendar.showTwoWeeks')}</Text>
                </TouchableOpacity>
              </View>

              <Calendar
                key={`${currentMonth.year}-${currentMonth.month}`}
                current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
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
            </>
          )}
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
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A5D6A7',
    marginTop: 10,
  },
  learnCard: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#173F27',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  learnCardText: {
    flex: 1,
    gap: 4,
  },
  learnEyebrow: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  learnTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  learnDescription: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
  },
  learnArrowWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnArrow: {
    color: '#FFFFFF',
    fontSize: 22,
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
  compactCalendar: {
    padding: 16,
    gap: 14,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  compactTitle: {
    color: '#173F27',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  compactSubtitle: {
    color: '#6C767D',
    fontSize: 13,
    marginTop: 3,
  },
  compactToggleButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  compactToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  compactNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  compactNavButton: {
    flex: 1,
    backgroundColor: '#F0F7F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8EAD9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  compactNavText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '700',
  },
  compactWeekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  compactWeekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#7D848A',
    fontSize: 11,
    fontWeight: '700',
  },
  compactWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  fullMonthHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  fullMonthTitle: {
    color: '#173F27',
    fontSize: 16,
    fontWeight: '800',
  },
  fullMonthToggle: {
    backgroundColor: '#F0F7F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8EAD9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fullMonthToggleText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '700',
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
