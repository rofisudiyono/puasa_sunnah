export const resources = {
  id: {
    translation: {
      common: {
        language: 'Bahasa',
      },
      calendar: {
        title: 'Kalender Puasa Sunnah',
        empty: 'Tidak ada puasa sunnah hari ini',
        availableFastings: '{{count}} Puasa Sunnah Tersedia',
        legendTitle: 'Keterangan Warna',
        legend: {
          seninKamis: 'Senin & Kamis',
          ayyamulBidh: 'Ayyamul Bidh',
          arafah: 'Arafah',
          asyura: 'Asyura',
          syawal: 'Syawal',
          syaban: "Sya'ban",
          dzulhijjah: 'Dzulhijjah',
          rajab: 'Rajab',
        },
      },
      detail: {
        notFound: 'Data puasa tidak ditemukan.',
        back: 'Kembali',
        virtueSection: '✨ Keutamaan & Fadilah',
        niatSection: '🤲 Niat Puasa',
        meaningLabel: 'Artinya:',
        shareButton: '🔗 Bagikan Info Puasa Ini',
        shareTitle: 'Fadilah',
      },
    },
  },
  en: {
    translation: {
      common: {
        language: 'Language',
      },
      calendar: {
        title: 'Sunnah Fasting Calendar',
        empty: 'No sunnah fasting scheduled today',
        availableFastings: '{{count}} Sunnah Fasts Available',
        legendTitle: 'Color Legend',
        legend: {
          seninKamis: 'Monday & Thursday',
          ayyamulBidh: 'Ayyamul Bidh',
          arafah: 'Arafah',
          asyura: 'Ashura',
          syawal: 'Shawwal',
          syaban: 'Sha\'ban',
          dzulhijjah: 'Dhul Hijjah',
          rajab: 'Rajab',
        },
      },
      detail: {
        notFound: 'Fasting data was not found.',
        back: 'Back',
        virtueSection: '✨ Virtues & Benefits',
        niatSection: '🤲 Fasting Intention',
        meaningLabel: 'Meaning:',
        shareButton: '🔗 Share This Fasting Info',
        shareTitle: 'Virtues',
      },
      puasa: {
        senin_kamis: {
          nama: 'Monday & Thursday Fasting',
          kategori: 'Weekly',
          deskripsiSingkat: 'Fasting observed every Monday and Thursday',
          niatArtinya: 'I intend to fast on Monday, as a sunnah for Allah Ta\'ala',
        },
        ayyamul_bidh: {
          nama: 'Ayyamul Bidh',
          kategori: 'Monthly',
          deskripsiSingkat: 'The three white days: 13th, 14th, 15th of each Hijri month',
          niatArtinya: 'I intend to fast Ayyamul Bidh as a sunnah for Allah Ta\'ala',
        },
        arafah: {
          nama: 'Arafah Fasting',
          kategori: 'Annual',
          deskripsiSingkat: 'Fasting on 9th Dhul Hijjah, the day of Arafah',
          niatArtinya: 'I intend to fast Arafah as a sunnah for Allah Ta\'ala',
        },
        tasua: {
          nama: 'Tasu\'a Fasting',
          kategori: 'Annual',
          deskripsiSingkat: 'Fasting on 9th Muharram, one day before Ashura',
          niatArtinya: 'I intend to fast Tasu\'a as a sunnah for Allah Ta\'ala',
        },
        asyura: {
          nama: 'Ashura Fasting',
          kategori: 'Annual',
          deskripsiSingkat: 'Fasting on 10th Muharram, a day with deep historical significance',
          niatArtinya: 'I intend to fast Ashura as a sunnah for Allah Ta\'ala',
        },
        syawal: {
          nama: 'Shawwal Fasting',
          kategori: 'Annual',
          deskripsiSingkat: 'Six days of fasting in Shawwal after Eid al-Fitr',
          niatArtinya: 'I intend to fast in Shawwal as a sunnah for Allah Ta\'ala',
        },
        rajab: {
          nama: 'Rajab Fasting',
          kategori: 'Special Month',
          deskripsiSingkat: 'Voluntary fasting in Rajab, one of the sacred months',
          niatArtinya: 'I intend to fast in Rajab as a sunnah for Allah Ta\'ala',
        },
        syaban: {
          nama: 'Sha\'ban Fasting',
          kategori: 'Special Month',
          deskripsiSingkat: 'Increasing fasting practice during Sha\'ban',
          niatArtinya: 'I intend to fast in Sha\'ban as a sunnah for Allah Ta\'ala',
        },
        nisfu_syaban: {
          nama: 'Nisfu Sha\'ban Fasting',
          kategori: 'Special Month',
          deskripsiSingkat: 'Fasting on 15th Sha\'ban',
          niatArtinya: 'I intend to fast Nisfu Sha\'ban as a sunnah for Allah Ta\'ala',
        },
        dzulhijjah: {
          nama: '1-8 Dhul Hijjah Fasting',
          kategori: 'Annual',
          deskripsiSingkat: 'Fasting during the first eight days of Dhul Hijjah',
          niatArtinya: 'I intend to fast in Dhul Hijjah as a sunnah for Allah Ta\'ala',
        },
      },
    },
  },
} as const;

export type TranslationResources = typeof resources;
