import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-hijri';
import 'moment/locale/id';

import {
  type CalendarMarking,
  generateMarkedDates,
  getPuasaOnDate,
  getHijriInfo,
} from '@/utils/puasaSunnah';
import HijriDayComponent, { type CalendarDateCell } from '@/components/HijriDayComponent';

moment.locale('id');

interface CalendarMonth {
  year: number;
  month: number;
}

export default function CalendarScreen() {
  const router = useRouter();
  const today = moment().format('YYYY-MM-DD');

  const [selectedDate, setSelectedDate] = useState(today);
  const [markedDates, setMarkedDates] = useState<Record<string, CalendarMarking>>({});
  const [currentMonth, setCurrentMonth] = useState({
    year: moment().year(),
    month: moment().month() + 1,
  });

  // Build marked dates setiap bulan berubah atau tanggal dipilih
  const buildMarked = useCallback(() => {
    const marked = generateMarkedDates(currentMonth.year, currentMonth.month);

    // Override selected date
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

  const puasaHariIni = getPuasaOnDate(selectedDate);
  const hijri = getHijriInfo(selectedDate);
  const formattedDate = moment(selectedDate).format('dddd, D MMMM YYYY');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kalender Puasa Sunnah</Text>
        <Text style={styles.headerSubtitle}>{hijri.fullDate}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Kalender */}
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

        {/* Legenda */}
        <LegendSection />

        {/* Detail Tanggal Terpilih */}
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailDate}>{formattedDate}</Text>
            <Text style={styles.detailHijri}>{hijri.fullDate}</Text>
          </View>

          {puasaHariIni.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>☀️</Text>
              <Text style={styles.emptyText}>Tidak ada puasa sunnah hari ini</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>
                {puasaHariIni.length} Puasa Sunnah Tersedia
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

function LegendSection() {
  const legends = [
    { color: '#4CAF50', label: 'Senin & Kamis' },
    { color: '#2196F3', label: 'Ayyamul Bidh' },
    { color: '#FF9800', label: 'Arafah' },
    { color: '#673AB7', label: 'Asyura' },
    { color: '#00BCD4', label: 'Syawal' },
    { color: '#FF5722', label: "Sya'ban" },
    { color: '#FFC107', label: 'Dzulhijjah' },
    { color: '#E91E63', label: 'Rajab' },
  ];

  return (
    <View style={styles.legendSection}>
      <Text style={styles.legendTitle}>Keterangan Warna</Text>
      <View style={styles.legendGrid}>
        {legends.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A5D6A7',
    marginTop: 4,
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
    padding: 16,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: '#616161',
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
