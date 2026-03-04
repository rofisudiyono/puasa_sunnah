import { useMemo } from 'react';
import moment from 'moment';

import { getPuasaSunnahForDate } from '@/utils/puasaSunnah';

export default function usePuasaCalendar(visibleMonth, selectedDate) {
  return useMemo(() => {
    const monthStart = visibleMonth
      ? moment(visibleMonth, 'YYYY-MM-DD').startOf('month')
      : moment().startOf('month');
    const monthEnd = monthStart.clone().endOf('month');
    const cursor = monthStart.clone();
    const markedDates = {};

    while (cursor.isSameOrBefore(monthEnd, 'day')) {
      const dateString = cursor.format('YYYY-MM-DD');
      const fastings = getPuasaSunnahForDate(dateString);

      if (fastings.length > 0) {
        markedDates[dateString] = {
          dots: fastings.map((item) => ({
            key: item.key,
            color: item.color,
          })),
        };
      }

      cursor.add(1, 'day');
    }

    if (selectedDate) {
      markedDates[selectedDate] = {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: '#0E7490',
      };
    }

    return { markedDates };
  }, [visibleMonth, selectedDate]);
}
