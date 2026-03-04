import moment from 'moment-hijri';

export interface FadilahItem {
  judul: string;
  isi: string;
  sumber: string;
}

export interface PuasaItem {
  id: string;
  nama: string;
  arabicName: string;
  kategori: string;
  color: string;
  dotColor: string;
  icon: string;
  deskripsiSingkat: string;
  fadilah: FadilahItem[];
  niat: string;
  niatLatin: string;
  niatArtinya: string;
}

export interface CalendarDot {
  key: string;
  color: string;
}

export interface CalendarMarking {
  dots: CalendarDot[];
  marked: true;
  selected?: boolean;
  selectedColor?: string;
}

export interface HijriInfo {
  day: number;
  month: number;
  year: number;
  monthName: string;
  fullDate: string;
}

type HijriMoment = ReturnType<typeof moment> & {
  iDate: () => number;
  iMonth: () => number;
  iYear: () => number;
};

function createHijriMoment(dateString: string): HijriMoment {
  return moment(dateString) as unknown as HijriMoment;
}

// ─────────────────────────────────────────────
// DATA FADILAH LENGKAP SETIAP PUASA SUNNAH
// ─────────────────────────────────────────────
export const PUASA_DATA: Record<string, PuasaItem> = {
  senin_kamis: {
    id: 'senin_kamis',
    nama: 'Puasa Senin & Kamis',
    arabicName: 'صيام يوم الاثنين والخميس',
    kategori: 'Mingguan',
    color: '#4CAF50',
    dotColor: '#4CAF50',
    icon: '🌿',
    deskripsiSingkat: 'Puasa yang dilakukan setiap hari Senin dan Kamis',
    fadilah: [
      {
        judul: 'Hari Dibukanya Pintu Surga',
        isi: 'Pintu-pintu surga dibuka pada hari Senin dan Kamis, lalu Allah mengampuni setiap hamba yang tidak menyekutukan-Nya dengan sesuatu pun.',
        sumber: 'HR. Muslim no. 2565',
      },
      {
        judul: 'Hari Diangkatnya Amal',
        isi: 'Rasulullah ﷺ bersabda: "Amal-amal manusia diangkat pada hari Senin dan Kamis, maka aku suka amalku diangkat ketika aku sedang berpuasa."',
        sumber: 'HR. Tirmidzi no. 747',
      },
      {
        judul: 'Sunnah Rasulullah ﷺ',
        isi: 'Aisyah radhiyallahu anha berkata bahwa Rasulullah ﷺ sangat memperhatikan puasa Senin dan Kamis, beliau senantiasa menjalankannya secara rutin.',
        sumber: 'HR. Tirmidzi no. 745',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ يَوْمِ الْاِثْنَيْنِ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma yaumil itsnaini sunnatan lillahi ta\'ala',
    niatArtinya: 'Saya niat puasa hari Senin, sunnah karena Allah Ta\'ala',
  },

  ayyamul_bidh: {
    id: 'ayyamul_bidh',
    nama: 'Ayyamul Bidh',
    arabicName: 'أيام البيض',
    kategori: 'Bulanan',
    color: '#2196F3',
    dotColor: '#2196F3',
    icon: '🌕',
    deskripsiSingkat: 'Puasa tiga hari putih: 13, 14, 15 setiap bulan Hijriah',
    fadilah: [
      {
        judul: 'Seperti Puasa Setahun Penuh',
        isi: 'Rasulullah ﷺ bersabda: "Puasa tiga hari setiap bulan sama dengan puasa sepanjang masa (setahun penuh)." Karena setiap kebaikan dibalas sepuluh kali lipat.',
        sumber: 'HR. Bukhari no. 1979, Muslim no. 1159',
      },
      {
        judul: 'Wasiat Nabi kepada Sahabat',
        isi: 'Abu Hurairah radhiyallahu anhu berkata: "Kekasihku (Rasulullah ﷺ) mewasiatkan kepadaku tiga hal: puasa tiga hari setiap bulan, shalat Dhuha dua rakaat, dan shalat witir sebelum tidur."',
        sumber: 'HR. Bukhari no. 1178',
      },
      {
        judul: 'Dinamakan Hari Putih',
        isi: 'Disebut Ayyamul Bidh (hari-hari putih) karena pada malam-malam tersebut bulan bersinar penuh (purnama), sehingga malamnya tampak putih terang benderang.',
        sumber: 'Penjelasan Para Ulama',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ أَيَّامِ الْبِيضِ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma ayyamil bidhi sunnatan lillahi ta\'ala',
    niatArtinya: 'Saya niat puasa Ayyamul Bidh, sunnah karena Allah Ta\'ala',
  },

  arafah: {
    id: 'arafah',
    nama: 'Puasa Arafah',
    arabicName: 'صيام يوم عرفة',
    kategori: 'Tahunan',
    color: '#FF9800',
    dotColor: '#FF9800',
    icon: '🕋',
    deskripsiSingkat: 'Puasa pada 9 Dzulhijjah, hari wukuf di Arafah',
    fadilah: [
      {
        judul: 'Penghapus Dosa Dua Tahun',
        isi: 'Rasulullah ﷺ ditanya tentang puasa Arafah, beliau menjawab: "Puasa Arafah menghapus dosa setahun yang lalu dan setahun yang akan datang."',
        sumber: 'HR. Muslim no. 1162',
      },
      {
        judul: 'Hari Paling Utama',
        isi: 'Tidak ada hari yang amal shalih di dalamnya lebih dicintai Allah daripada hari-hari 10 Dzulhijjah, termasuk hari Arafah yang merupakan puncaknya.',
        sumber: 'HR. Bukhari no. 969',
      },
      {
        judul: 'Khusus bagi yang Tidak Haji',
        isi: 'Puasa Arafah dianjurkan bagi yang tidak sedang menunaikan ibadah haji. Adapun jamaah haji tidak dianjurkan berpuasa pada hari ini agar kuat untuk beribadah.',
        sumber: 'HR. Bukhari no. 1988',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ عَرَفَةَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma arafata sunnatan lillahi ta\'ala',
    niatArtinya: 'Saya niat puasa Arafah, sunnah karena Allah Ta\'ala',
  },

  tasua: {
    id: 'tasua',
    nama: "Puasa Tasu'a",
    arabicName: 'صيام يوم تاسوعاء',
    kategori: 'Tahunan',
    color: '#9C27B0',
    dotColor: '#9C27B0',
    icon: '🌙',
    deskripsiSingkat: 'Puasa pada 9 Muharram, sehari sebelum Asyura',
    fadilah: [
      {
        judul: 'Pembeda dengan Yahudi',
        isi: 'Rasulullah ﷺ bersabda: "Jika aku masih hidup tahun depan, sungguh aku akan berpuasa pada hari kesembilan (Muharram)." Ini sebagai pembeda dari cara puasa kaum Yahudi yang hanya berpuasa pada hari kesepuluh.',
        sumber: 'HR. Muslim no. 1134',
      },
      {
        judul: 'Pelengkap Puasa Asyura',
        isi: 'Para ulama menganjurkan untuk menggabungkan puasa Tasu\'a dengan Asyura (9 dan 10 Muharram) agar mendapatkan keutamaan yang sempurna dan membedakan diri dari tradisi Yahudi.',
        sumber: 'Fatwa Ibnu Taimiyyah',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ تَاسُوعَاءَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma tasu\'a\'a sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Tasu'a, sunnah karena Allah Ta'ala",
  },

  asyura: {
    id: 'asyura',
    nama: 'Puasa Asyura',
    arabicName: 'صيام يوم عاشوراء',
    kategori: 'Tahunan',
    color: '#673AB7',
    dotColor: '#673AB7',
    icon: '⭐',
    deskripsiSingkat: 'Puasa pada 10 Muharram, hari penuh sejarah',
    fadilah: [
      {
        judul: 'Penghapus Dosa Setahun Lalu',
        isi: 'Rasulullah ﷺ bersabda: "Puasa Asyura, aku berharap kepada Allah agar menghapuskan dosa setahun yang lalu."',
        sumber: 'HR. Muslim no. 1162',
      },
      {
        judul: 'Puasa yang Paling Utama Setelah Ramadan',
        isi: 'Dari Abu Hurairah radhiyallahu anhu, Rasulullah ﷺ bersabda: "Puasa yang paling utama setelah Ramadan adalah puasa di bulan Allah, Muharram."',
        sumber: 'HR. Muslim no. 1163',
      },
      {
        judul: 'Hari Nabi Musa Diselamatkan',
        isi: 'Pada hari Asyura, Allah menyelamatkan Nabi Musa dan Bani Israil dari Firaun. Maka Nabi Musa berpuasa sebagai bentuk syukur, dan Rasulullah ﷺ pun mengikutinya.',
        sumber: 'HR. Bukhari no. 2004, Muslim no. 1130',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ عَاشُورَاءَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma asyura\'a sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Asyura, sunnah karena Allah Ta'ala",
  },

  syawal: {
    id: 'syawal',
    nama: 'Puasa Syawal',
    arabicName: 'صيام ستة من شوال',
    kategori: 'Tahunan',
    color: '#00BCD4',
    dotColor: '#00BCD4',
    icon: '🎉',
    deskripsiSingkat: 'Puasa 6 hari di bulan Syawal setelah Idul Fitri',
    fadilah: [
      {
        judul: 'Seperti Puasa Setahun Penuh',
        isi: 'Rasulullah ﷺ bersabda: "Barang siapa yang berpuasa Ramadan kemudian mengikutinya dengan enam hari di bulan Syawal, maka ia seperti berpuasa sepanjang tahun."',
        sumber: 'HR. Muslim no. 1164',
      },
      {
        judul: 'Penyempurna Puasa Ramadan',
        isi: 'Para ulama menjelaskan bahwa puasa Syawal berfungsi seperti shalat sunnah rawatib — menutupi kekurangan dan menyempurnakan ibadah wajib yang mungkin ada kekurangannya.',
        sumber: 'Syarh Nawawi atas Muslim',
      },
      {
        judul: 'Boleh Tidak Berurutan',
        isi: 'Mayoritas ulama berpendapat bahwa keenam hari puasa Syawal boleh dilakukan secara berurutan maupun terpisah, yang penting masih dalam bulan Syawal.',
        sumber: 'Fatwa Syaikh Ibn Utsaimin',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ شَوَّالٍ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma syawwalin sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Syawal, sunnah karena Allah Ta'ala",
  },

  rajab: {
    id: 'rajab',
    nama: 'Puasa Rajab',
    arabicName: 'صيام شهر رجب',
    kategori: 'Bulanan Khusus',
    color: '#E91E63',
    dotColor: '#E91E63',
    icon: '🌸',
    deskripsiSingkat: 'Puasa di bulan Rajab, salah satu bulan haram',
    fadilah: [
      {
        judul: 'Bulan Haram yang Dimuliakan',
        isi: 'Rajab adalah salah satu dari empat bulan haram (Dzulqadah, Dzulhijjah, Muharram, Rajab). Allah berfirman bahwa bulan-bulan ini adalah bulan yang dimuliakan, janganlah menzalimi diri sendiri di dalamnya.',
        sumber: 'QS. At-Taubah: 36',
      },
      {
        judul: 'Dianjurkan Memperbanyak Ibadah',
        isi: 'Para ulama menganjurkan untuk memperbanyak ibadah, termasuk puasa, di bulan-bulan haram. Meskipun tidak ada hadits shahih khusus tentang keutamaan puasa Rajab, namun keumuman keutamaan bulan haram mencakupnya.',
        sumber: 'Pendapat Imam Nawawi',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ رَجَبَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma rajaba sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Rajab, sunnah karena Allah Ta'ala",
  },

  syaban: {
    id: 'syaban',
    nama: "Puasa Sya'ban",
    arabicName: "صيام شهر شعبان",
    kategori: 'Bulanan Khusus',
    color: '#FF5722',
    dotColor: '#FF5722',
    icon: '🌺',
    deskripsiSingkat: "Memperbanyak puasa di bulan Sya'ban",
    fadilah: [
      {
        judul: "Bulan yang Sering Dilalaikan",
        isi: "Usamah bin Zaid radhiyallahu anhu bertanya kepada Rasulullah ﷺ: 'Wahai Rasulullah, aku tidak pernah melihatmu berpuasa dalam sebulan seperti engkau berpuasa di bulan Sya'ban.' Beliau menjawab: 'Bulan itu banyak dilalaikan orang, yaitu antara Rajab dan Ramadan.'",
        sumber: 'HR. Nasa\'i no. 2357',
      },
      {
        judul: 'Diangkatnya Amalan ke Hadirat Allah',
        isi: "Rasulullah ﷺ bersabda bahwa di bulan Sya'ban amalan-amalan diangkat ke hadapan Allah, dan beliau senang amalannya diangkat dalam keadaan sedang berpuasa.",
        sumber: 'HR. Nasa\'i no. 2357',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ شَعْبَانَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma sya\'bana sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Sya'ban, sunnah karena Allah Ta'ala",
  },

  nisfu_syaban: {
    id: 'nisfu_syaban',
    nama: "Puasa Nisfu Sya'ban",
    arabicName: "صيام نصف شعبان",
    kategori: 'Bulanan Khusus',
    color: '#FF7043',
    dotColor: '#FF7043',
    icon: '🌟',
    deskripsiSingkat: "Puasa pada 15 Sya'ban, malam penuh kemuliaan",
    fadilah: [
      {
        judul: 'Malam Pengampunan',
        isi: "Pada malam Nisfu Sya'ban, Allah turun ke langit dunia dan mengampuni dosa lebih banyak dari jumlah bulu domba Bani Kalb. Allah mengampuni semua orang kecuali orang musyrik dan orang yang bermusuhan.",
        sumber: 'HR. Tirmidzi no. 739',
      },
      {
        judul: 'Dianjurkan Menghidupkan Malam',
        isi: "Para ulama menganjurkan untuk menghidupkan malam Nisfu Sya'ban dengan shalat, dzikir, dan doa, serta berpuasa pada siang harinya sebagai bentuk pengagungan terhadap malam tersebut.",
        sumber: 'Latha\'iful Ma\'arif, Ibnu Rajab',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ نِصْفِ شَعْبَانَ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma nishfi sya\'bana sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Nisfu Sya'ban, sunnah karena Allah Ta'ala",
  },

  dzulhijjah: {
    id: 'dzulhijjah',
    nama: 'Puasa 1-8 Dzulhijjah',
    arabicName: 'صيام أوائل ذي الحجة',
    kategori: 'Tahunan',
    color: '#FFC107',
    dotColor: '#FFC107',
    icon: '🕌',
    deskripsiSingkat: 'Puasa di 8 hari pertama bulan Dzulhijjah',
    fadilah: [
      {
        judul: 'Hari-hari Terbaik dalam Setahun',
        isi: 'Rasulullah ﷺ bersabda: "Tidak ada hari-hari yang amal shalih di dalamnya lebih dicintai Allah daripada sepuluh hari (pertama Dzulhijjah) ini." Para sahabat bertanya: "Tidak juga jihad fi sabilillah?" Beliau menjawab: "Tidak juga jihad fi sabilillah."',
        sumber: 'HR. Bukhari no. 969',
      },
      {
        judul: 'Dianjurkan Puasa Seluruhnya',
        isi: 'Para ulama, di antaranya Imam Ahmad, menganjurkan berpuasa pada seluruh sembilan hari pertama Dzulhijjah (1-9), karena mencakup hari Arafah yang memiliki keutamaan luar biasa.',
        sumber: 'Al-Mughni, Ibnu Qudamah',
      },
    ],
    niat: 'نَوَيْتُ صَوْمَ ذِي الْحِجَّةِ سُنَّةً لِلَّهِ تَعَالَى',
    niatLatin: 'Nawaitu shauma dzil hijjati sunnatan lillahi ta\'ala',
    niatArtinya: "Saya niat puasa Dzulhijjah, sunnah karena Allah Ta'ala",
  },
};

// ─────────────────────────────────────────────
// NAMA BULAN HIJRIAH
// ─────────────────────────────────────────────
export const NAMA_BULAN_HIJRI: string[] = [
  '', 'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
  'Ramadan', 'Syawal', 'Dzulqadah', 'Dzulhijjah',
];

// ─────────────────────────────────────────────
// FUNGSI UTAMA: Cek puasa di tanggal tertentu
// ─────────────────────────────────────────────
export function getPuasaOnDate(dateString: string): PuasaItem[] {
  const m = createHijriMoment(dateString);
  const dayOfWeek = m.day();       // 0=Ahad, 1=Senin, 4=Kamis
  const hijriDay = m.iDate();      // 1-30
  const hijriMonth = m.iMonth() + 1; // 1-12

  const hasil: PuasaItem[] = [];

  // ── Mingguan ──────────────────────
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    hasil.push(PUASA_DATA.senin_kamis);
  }

  // ── Bulanan ───────────────────────
  if ([13, 14, 15].includes(hijriDay)) {
    hasil.push(PUASA_DATA.ayyamul_bidh);
  }

  // ── Muharram ──────────────────────
  if (hijriMonth === 1) {
    if (hijriDay === 9) hasil.push(PUASA_DATA.tasua);
    if (hijriDay === 10) hasil.push(PUASA_DATA.asyura);
  }

  // ── Rajab ─────────────────────────
  if (hijriMonth === 7) {
    hasil.push(PUASA_DATA.rajab);
  }

  // ── Sya'ban ───────────────────────
  if (hijriMonth === 8) {
    if (hijriDay === 15) {
      hasil.push(PUASA_DATA.nisfu_syaban);
    } else {
      hasil.push(PUASA_DATA.syaban);
    }
  }

  // ── Dzulhijjah ────────────────────
  if (hijriMonth === 12) {
    if (hijriDay >= 1 && hijriDay <= 8) hasil.push(PUASA_DATA.dzulhijjah);
    if (hijriDay === 9) hasil.push(PUASA_DATA.arafah);
  }

  // ── Syawal ────────────────────────
  if (hijriMonth === 10 && hijriDay >= 2 && hijriDay <= 30) {
    hasil.push(PUASA_DATA.syawal);
  }

  return hasil;
}

// ─────────────────────────────────────────────
// GENERATE MARKED DATES untuk react-native-calendars
// ─────────────────────────────────────────────
export function generateMarkedDates(year: number, month: number): Record<string, CalendarMarking> {
  const marked: Record<string, CalendarMarking> = {};
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-M').daysInMonth();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const puasaList = getPuasaOnDate(dateStr);

    if (puasaList.length > 0) {
      // Deduplicate dots by id
      const seen = new Set<string>();
      const dots = puasaList
        .filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        })
        .slice(0, 3)
        .map((p) => ({ key: p.id, color: p.dotColor }));

      marked[dateStr] = { dots, marked: true };
    }
  }

  return marked;
}

// ─────────────────────────────────────────────
// HELPER: Info Hijriah dari dateString
// ─────────────────────────────────────────────
export function getHijriInfo(dateString: string): HijriInfo {
  const m = createHijriMoment(dateString);
  const monthNum = m.iMonth() + 1;
  return {
    day: m.iDate(),
    month: monthNum,
    year: m.iYear(),
    monthName: NAMA_BULAN_HIJRI[monthNum],
    fullDate: `${m.iDate()} ${NAMA_BULAN_HIJRI[monthNum]} ${m.iYear()} H`,
  };
}

export function getPuasaById(id: string): PuasaItem | undefined {
  return Object.values(PUASA_DATA).find((item) => item.id === id);
}
