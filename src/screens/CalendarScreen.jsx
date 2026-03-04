import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import HijriDayComponent from '@/components/HijriDayComponent';
import usePuasaCalendar from '@/hooks/usePuasaCalendar';
import { setupPuasaReminder } from '@/notifications/reminderSetup';
import { formatHijriDate } from '@/utils/hijriHelper';
import { getPuasaSunnahForDate } from '@/utils/puasaSunnah';

const TODAY = moment().format('YYYY-MM-DD');

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [visibleMonth, setVisibleMonth] = useState(TODAY);
  const { markedDates } = usePuasaCalendar(visibleMonth, selectedDate);

  const selectedFastings = useMemo(() => getPuasaSunnahForDate(selectedDate), [selectedDate]);

  const enableReminder = async () => {
    const reminderId = await setupPuasaReminder();

    if (reminderId) {
      Alert.alert('Pengingat aktif', 'Notifikasi harian telah diatur pukul 03:30.');
      return;
    }

    Alert.alert('Izin ditolak', 'Izinkan notifikasi agar pengingat bisa aktif.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Kalender Puasa Sunnah</Text>
        <Text style={styles.subtitle}>Tanggal Hijriah ditampilkan di setiap hari kalender.</Text>

        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={(month) => {
              const monthDate = `${month.year}-${String(month.month).padStart(2, '0')}-01`;
              setVisibleMonth(monthDate);
            }}
            dayComponent={({ date, state, marking }) => (
              <HijriDayComponent
                date={date}
                state={state}
                marking={marking}
                onPress={(selected) => setSelectedDate(selected.dateString)}
              />
            )}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{moment(selectedDate).format('dddd, DD MMMM YYYY')}</Text>
          <Text style={styles.infoHijri}>{formatHijriDate(selectedDate)}</Text>

          {selectedFastings.length > 0 ? (
            selectedFastings.map((item) => (
              <View key={item.key} style={styles.badgeRow}>
                <View style={[styles.badgeDot, { backgroundColor: item.color }]} />
                <Text style={styles.badgeLabel}>{item.label}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Tidak ada puasa sunnah khusus pada tanggal ini.</Text>
          )}
        </View>

        <Pressable style={styles.reminderButton} onPress={enableReminder}>
          <Text style={styles.reminderButtonText}>Aktifkan Pengingat Harian</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
  },
  calendarCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  infoHijri: {
    fontSize: 14,
    color: '#0F766E',
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badgeLabel: {
    fontSize: 14,
    color: '#1F2937',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reminderButton: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  reminderButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
