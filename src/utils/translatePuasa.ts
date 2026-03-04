import type { TFunction } from 'i18next';

import type { PuasaItem } from '@/utils/puasaSunnah';

export function translatePuasaItem(t: TFunction, puasa: PuasaItem): PuasaItem {
  return {
    ...puasa,
    nama: t(`puasa.${puasa.id}.nama`, { defaultValue: puasa.nama }),
    kategori: t(`puasa.${puasa.id}.kategori`, { defaultValue: puasa.kategori }),
    deskripsiSingkat: t(`puasa.${puasa.id}.deskripsiSingkat`, { defaultValue: puasa.deskripsiSingkat }),
    niatArtinya: t(`puasa.${puasa.id}.niatArtinya`, { defaultValue: puasa.niatArtinya }),
    fadilah: puasa.fadilah.map((item, index) => ({
      judul: t(`puasa.${puasa.id}.fadilah.${index}.judul`, { defaultValue: item.judul }),
      isi: t(`puasa.${puasa.id}.fadilah.${index}.isi`, { defaultValue: item.isi }),
      sumber: t(`puasa.${puasa.id}.fadilah.${index}.sumber`, { defaultValue: item.sumber }),
    })),
  };
}
