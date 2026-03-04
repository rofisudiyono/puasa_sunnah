import type { AppLanguage } from '@/i18n';

export interface CalendarLegendItem {
  color: string;
  labelKey: string;
}

export const WEEKDAY_LABELS: Record<AppLanguage, string[]> = {
  id: ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'],
  en: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
};

export const CALENDAR_LEGENDS: CalendarLegendItem[] = [
  { color: '#2FBF5B', labelKey: 'calendar.legend.seninKamis' },
  { color: '#3B7DDD', labelKey: 'calendar.legend.ayyamulBidh' },
  { color: '#F59E0B', labelKey: 'calendar.legend.arafah' },
  { color: '#7C4DFF', labelKey: 'calendar.legend.asyura' },
  { color: '#1AA8C7', labelKey: 'calendar.legend.syawal' },
  { color: '#EA580C', labelKey: 'calendar.legend.syaban' },
  { color: '#D4A90A', labelKey: 'calendar.legend.dzulhijjah' },
  { color: '#DB489D', labelKey: 'calendar.legend.rajab' },
];
