import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getHijriInfo } from '@/utils/puasaSunnah';
import type { AppLanguage } from '@/i18n';

export interface CalendarDateCell {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

interface CalendarDot {
  key: string;
  color: string;
}

interface DayMarking {
  selected?: boolean;
  dots?: CalendarDot[];
}

interface HijriDayComponentProps {
  date?: CalendarDateCell;
  state?: string;
  marking?: DayMarking;
  language?: AppLanguage;
  onPress: (date: CalendarDateCell) => void;
}

export default function HijriDayComponent({
  date,
  state,
  marking,
  language = 'id',
  onPress,
}: HijriDayComponentProps) {
  if (!date) {
    return null;
  }

  const hijri = getHijriInfo(date.dateString, language);
  const isToday = state === 'today';
  const isDisabled = state === 'disabled';
  const isSelected = Boolean(marking?.selected);
  const dots = marking?.dots || [];

  const showHijriMonth = hijri.day === 1;

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Lingkaran tanggal Masehi */}
      <View style={[
        styles.dayCircle,
        isToday && styles.todayCircle,
        isSelected && !isToday && styles.selectedCircle,
      ]}>
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isSelected && !isToday && styles.selectedText,
          isDisabled && styles.disabledText,
        ]}>
          {date.day}
        </Text>
      </View>

      {/* Tanggal Hijriah */}
      <Text style={[styles.hijriText, isDisabled && styles.disabledText]}>
        {hijri.day}{showHijriMonth ? ` ${hijri.monthName.slice(0, 3)}` : ''}
      </Text>

      {/* Dots indikator puasa */}
      <View style={styles.dotsRow}>
        {dots.slice(0, 3).map((dot, idx) => (
          <View
            key={`${dot.key}-${idx}`}
            style={[styles.dot, { backgroundColor: dot.color }]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: 40,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: '#1B5E20',
    backgroundColor: '#FFFFFF',
  },
  selectedCircle: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
  },
  dayText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  todayText: {
    color: '#1B5E20',
    fontWeight: '700',
  },
  selectedText: {
    color: '#1B5E20',
    fontWeight: '700',
  },
  disabledText: {
    color: '#ccc',
  },
  hijriText: {
    fontSize: 8,
    color: '#9E9E9E',
    marginTop: 1,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
