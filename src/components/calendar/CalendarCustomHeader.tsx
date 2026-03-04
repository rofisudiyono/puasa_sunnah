import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import moment from 'moment-hijri';

import type { AppLanguage } from '@/i18n';
import { WEEKDAY_LABELS } from '@/dummy/calendarUiDummy';
import { getHijriInfo } from '@/utils/puasaSunnah';

interface CalendarCustomHeaderProps {
  language: AppLanguage;
  fallbackYear: number;
  fallbackMonth: number;
  addMonth?: (count: number) => void;
  month?: { toString: (format?: string) => string };
}

function capitalizeWords(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveMonthDate(month: CalendarCustomHeaderProps['month'], year: number, monthNumber: number) {
  if (month?.toString) {
    const parsed = moment(month.toString('yyyy-MM-dd'), 'YYYY-MM-DD', true);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  return moment(`${year}-${String(monthNumber).padStart(2, '0')}-01`, 'YYYY-MM-DD');
}

export default function CalendarCustomHeader({
  language,
  fallbackYear,
  fallbackMonth,
  addMonth,
  month,
}: CalendarCustomHeaderProps) {
  const visibleMonth = resolveMonthDate(month, fallbackYear, fallbackMonth).locale(language);
  const monthTitle = capitalizeWords(visibleMonth.format('MMMM YYYY'));
  const hijriMonthInfo = getHijriInfo(visibleMonth.clone().startOf('month').format('YYYY-MM-DD'), language);

  return (
    <View style={styles.calendarHeaderWrap}>
      <View style={styles.calendarMonthRow}>
        <Pressable style={styles.navButton} onPress={() => addMonth?.(-1)} hitSlop={8}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </Pressable>

        <View style={styles.monthTitleWrap}>
          <Text style={styles.monthTitle}>{monthTitle}</Text>
          <Text style={styles.hijriMonthTitle}>{`${hijriMonthInfo.monthName} ${hijriMonthInfo.year} H`}</Text>
        </View>

        <Pressable style={styles.navButton} onPress={() => addMonth?.(1)} hitSlop={8}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS[language].map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarHeaderWrap: {
    paddingTop: 18,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F7C3E',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
    marginTop: -2,
  },
  monthTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 2,
  },
  monthTitle: {
    color: '#12492A',
    fontSize: 21,
    fontWeight: '800',
  },
  hijriMonthTitle: {
    color: '#7A838A',
    fontSize: 16,
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  weekdayLabel: {
    width: 44,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#7D848A',
    letterSpacing: 0.2,
  },
});
