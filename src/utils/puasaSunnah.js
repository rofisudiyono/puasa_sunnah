import moment from 'moment-hijri';

import { getHijriDayMonth } from './hijriHelper';

const FASTING_COLORS = {
  mondayThursday: '#0F766E',
  ayyamulBidh: '#2563EB',
  tasua: '#9333EA',
  asyura: '#DC2626',
  tarwiyah: '#EA580C',
  arafah: '#16A34A',
};

export function getPuasaSunnahForDate(dateInput) {
  const date = moment(dateInput).startOf('day');
  const results = [];

  if (date.day() === 1) {
    results.push({
      key: 'senin',
      label: 'Puasa Senin',
      color: FASTING_COLORS.mondayThursday,
    });
  }

  if (date.day() === 4) {
    results.push({
      key: 'kamis',
      label: 'Puasa Kamis',
      color: FASTING_COLORS.mondayThursday,
    });
  }

  const { day, monthIndex } = getHijriDayMonth(date);

  if (day >= 13 && day <= 15) {
    results.push({
      key: 'ayyamul-bidh',
      label: 'Puasa Ayyamul Bidh',
      color: FASTING_COLORS.ayyamulBidh,
    });
  }

  if (monthIndex === 0 && day === 9) {
    results.push({
      key: 'tasua',
      label: "Puasa Tasu'a (9 Muharram)",
      color: FASTING_COLORS.tasua,
    });
  }

  if (monthIndex === 0 && day === 10) {
    results.push({
      key: 'asyura',
      label: 'Puasa Asyura (10 Muharram)',
      color: FASTING_COLORS.asyura,
    });
  }

  if (monthIndex === 11 && day === 8) {
    results.push({
      key: 'tarwiyah',
      label: 'Puasa Tarwiyah (8 Zulhijah)',
      color: FASTING_COLORS.tarwiyah,
    });
  }

  if (monthIndex === 11 && day === 9) {
    results.push({
      key: 'arafah',
      label: 'Puasa Arafah (9 Zulhijah)',
      color: FASTING_COLORS.arafah,
    });
  }

  return results;
}

export function hasPuasaSunnah(dateInput) {
  return getPuasaSunnahForDate(dateInput).length > 0;
}
