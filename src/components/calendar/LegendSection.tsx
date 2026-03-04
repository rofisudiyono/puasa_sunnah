import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CALENDAR_LEGENDS } from '@/dummy/calendarUiDummy';

export default function LegendSection() {
  const { t } = useTranslation();

  return (
    <View style={styles.legendSection}>
      <Text style={styles.legendTitle}>{t('calendar.legendTitle')}</Text>
      <View style={styles.legendGrid}>
        {CALENDAR_LEGENDS.map((item) => (
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
  legendSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#05290F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#7D848A',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 6,
    justifyContent: 'space-between',
  },
  legendItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
  },
  legendLabel: {
    color: '#164B30',
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
  },
});
