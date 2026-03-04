import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatHijriCompact } from '@/utils/hijriHelper';

export default function HijriDayComponent({ date, state, marking, onPress }) {
  if (!date) {
    return null;
  }

  const isDisabled = state === 'disabled';
  const isSelected = Boolean(marking?.selected);
  const firstDotColor = marking?.dots?.[0]?.color;

  return (
    <Pressable
      style={[styles.wrapper, isSelected && styles.selected]}
      onPress={() => onPress?.(date)}>
      <Text style={[styles.gregorian, isDisabled && styles.disabled, isSelected && styles.selectedText]}>
        {date.day}
      </Text>
      <Text style={[styles.hijri, isDisabled && styles.disabled, isSelected && styles.selectedText]}>
        {formatHijriCompact(date.dateString)}
      </Text>
      {firstDotColor ? <View style={[styles.dot, { backgroundColor: firstDotColor }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 50,
    width: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  selected: {
    backgroundColor: '#0E7490',
  },
  gregorian: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  hijri: {
    fontSize: 8,
    color: '#6B7280',
  },
  disabled: {
    opacity: 0.35,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 1,
  },
});
