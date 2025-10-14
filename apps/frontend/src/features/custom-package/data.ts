import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';

export type CatalogTab = 'menstrual' | 'support';

export interface CatalogGroup {
  id: string;
  type: CatalogTab;
  title: string;
  brand: string;
  packInfo: string;
  recommendation?: string;
  recommendationTone?: 'green' | 'amber';
  icon: typeof FavoriteRoundedIcon;
  items: Array<{
    productId: string;
    label: string;
    accent: string;
  }>;
}

export const PRODUCT_CATALOG: CatalogGroup[] = [
  {
    id: 'pads',
    type: 'menstrual',
    title: 'beije Ped',
    brand: 'beije',
    packInfo: '10 adet Standart Ped ve 10 adet Süper Ped',
    recommendation:
      'Çoğu beije kullanıcısı normal yoğunlukta bir regl dönemi için abonelik paketinde 20 Standart, 20 Süper Ped tercih ediyor.',
    recommendationTone: 'green',
    icon: FavoriteRoundedIcon,
    items: [
      { productId: 'pads-standard', label: 'Standart Ped', accent: '#f07b3f' },
      { productId: 'pads-super', label: 'Süper Ped', accent: '#b43a28' },
      { productId: 'pads-superplus', label: 'Süper+ Ped', accent: '#6f1d1b' },
    ],
  },
  {
    id: 'liners',
    type: 'menstrual',
    title: 'beije Günlük Ped',
    brand: 'beije',
    packInfo: '10 adet Günlük Ped',
    recommendation:
      "Kullanıcılarımızın %68'i akıntıları olan günlerde Standart Günlük Ped'i, regl döneminin son günlerinde veya daha yoğun akıntıları olan günlerde ise Süper Günlük Ped'i tercih ediyor.",
    recommendationTone: 'green',
    icon: WaterDropRoundedIcon,
    items: [
      { productId: 'liners-standard', label: 'Günlük Ped', accent: '#f5862f' },
      { productId: 'liners-super', label: 'Süper Günlük Ped', accent: '#d97706' },
      { productId: 'liners-thong', label: 'Tanga Günlük Ped', accent: '#facc15' },
    ],
  },
  {
    id: 'tampons',
    type: 'menstrual',
    title: 'beije Tampon',
    brand: 'beije',
    packInfo: '10 adet Mini Tampon',
    icon: WaterDropRoundedIcon,
    items: [
      { productId: 'tampon-mini', label: 'Mini Tampon', accent: '#a855f7' },
      { productId: 'tampon-standard', label: 'Standart Tampon', accent: '#7c3aed' },
      { productId: 'tampon-super', label: 'Süper Tampon', accent: '#5b21b6' },
    ],
  },
  {
    id: 'heat-bands',
    type: 'support',
    title: 'Isı Bandı',
    brand: 'beije',
    packInfo: "1 adet 2'li Paket Isı Bandı ve 2 adet 4'lü Paket Isı Bandı",
    recommendation:
      "Isı Bandı'nı hem kas ağrıların hem de regl ağrıların için kullanabilirsin!",
    recommendationTone: 'amber',
    icon: LocalFireDepartmentRoundedIcon,
    items: [
      { productId: 'heat-pack-duo', label: "2'li Paket Isı Bandı", accent: '#f97316' },
      { productId: 'heat-pack-quad', label: "4'lü Paket Isı Bandı", accent: '#ea580c' },
    ],
  },
  {
    id: 'cycle-essentials',
    type: 'support',
    title: 'beije Cycle Essentials',
    brand: 'beije',
    packInfo: '2 adet beije Cycle Essentials',
    recommendation:
      'Cycle Essentials’ın bir şişesi, iki aylık döngüne yetecek miktarda, 32 kapsül içerir.',
    recommendationTone: 'amber',
    icon: FavoriteRoundedIcon,
    items: [
      {
        productId: 'cycle-essentials',
        label: 'beije Cycle Essentials',
        accent: '#f97316',
      },
    ],
  },
  {
    id: 'cranberry',
    type: 'support',
    title: 'beije Cranberry Essentials',
    brand: 'beije',
    packInfo: '2 adet beije Cranberry Essentials',
    recommendation:
      'Cranberry Essentials’ın bir şişesi, tamamen vegan bileşenlerden oluşan 30 kapsül içerir.',
    recommendationTone: 'amber',
    icon: FavoriteRoundedIcon,
    items: [
      {
        productId: 'cranberry-essentials',
        label: 'beije Cranberry Essentials',
        accent: '#9333ea',
      },
    ],
  },
];

export const TABS: Array<{ id: CatalogTab; label: string }> = [
  { id: 'menstrual', label: 'Menstrüel Ürünler' },
  { id: 'support', label: 'Destekleyici Ürünler' },
];


