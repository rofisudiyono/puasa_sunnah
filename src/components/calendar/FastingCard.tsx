import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import type { PuasaItem } from '@/utils/puasaSunnah';

interface FastingCardProps {
  puasa: PuasaItem;
  onPress: () => void;
}

export default function FastingCard({ puasa, onPress }: FastingCardProps) {
  return (
    <TouchableOpacity style={styles.puasaCard} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.puasaColorBar, { backgroundColor: puasa.color }]} />

      <View style={styles.puasaContent}>
        <View style={styles.puasaTop}>
          <View style={[styles.puasaIconCircle, { backgroundColor: `${puasa.color}2A` }]}>
            <Text style={styles.puasaIcon}>{puasa.icon}</Text>
          </View>

          <View style={styles.puasaTextGroup}>
            <Text style={styles.puasaNama}>{puasa.nama}</Text>
            <View style={[styles.puasaBadge, { backgroundColor: `${puasa.color}24` }]}>
              <Text style={[styles.puasaBadgeText, { color: puasa.color }]}>{puasa.kategori}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.puasaDeskripsi} numberOfLines={2}>
          {puasa.deskripsiSingkat}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  puasaCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE5E8',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  puasaColorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  puasaContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 9,
  },
  puasaTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  puasaIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puasaIcon: {
    fontSize: 24,
  },
  puasaTextGroup: {
    flex: 1,
    gap: 4,
  },
  puasaNama: {
    color: '#12492A',
    fontSize: 18,
    fontWeight: '800',
  },
  puasaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  puasaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  puasaDeskripsi: {
    color: '#7B838A',
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 58,
  },
});
