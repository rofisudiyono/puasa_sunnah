import moment from 'moment-hijri';

const HIJRI_MONTH_NAMES_ID = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syaban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
];

function toHijriMoment(dateInput) {
  return moment(dateInput).startOf('day');
}

export function getHijriDayMonth(dateInput) {
  const hijriMoment = toHijriMoment(dateInput);

  return {
    day: Number(hijriMoment.format('iD')),
    monthIndex: hijriMoment.iMonth(),
    year: hijriMoment.iYear(),
  };
}

export function formatHijriDate(dateInput) {
  const { day, monthIndex, year } = getHijriDayMonth(dateInput);
  const monthName = HIJRI_MONTH_NAMES_ID[monthIndex];
  return `${day} ${monthName} ${year} H`;
}

export function formatHijriCompact(dateInput) {
  const { day, monthIndex } = getHijriDayMonth(dateInput);
  const monthName = HIJRI_MONTH_NAMES_ID[monthIndex];
  return `${day} ${monthName}`;
}
