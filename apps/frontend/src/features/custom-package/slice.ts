import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  PackageState,
} from './types';

const initialState: PackageState = {
  items: [
    {
      id: 'pads-standard',
      name: 'Standart Ped',
      description: 'Günlük kullanım için ultra ince bambu ped.',
      category: 'pads',
      price: 9.51,
      unitLabel: 'adet',
      quantity: 10,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'pads-super',
      name: 'Süper Ped',
      description: 'Yoğun günler için ekstra emici ped.',
      category: 'pads',
      price: 10.61,
      unitLabel: 'adet',
      quantity: 10,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'pads-superplus',
      name: 'Süper+ Ped',
      description: 'Ekstra yoğun günler için maksimum koruma.',
      category: 'pads',
      price: 11.25,
      unitLabel: 'adet',
      quantity: 0,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'liners-standard',
      name: 'Günlük Ped',
      description: 'Günlük ferahlık için nefes alan günlük ped.',
      category: 'liners',
      price: 5.51,
      unitLabel: 'adet',
      quantity: 10,
      min: 0,
      max: 100,
      step: 10,
    },
    {
      id: 'liners-super',
      name: 'Süper Günlük Ped',
      description: 'Daha yoğun günlerde ekstra güven.',
      category: 'liners',
      price: 6.12,
      unitLabel: 'adet',
      quantity: 0,
      min: 0,
      max: 100,
      step: 10,
    },
    {
      id: 'liners-thong',
      name: 'Tanga Günlük Ped',
      description: 'Tanga iç çamaşırlarıyla uyumlu ince ped.',
      category: 'liners',
      price: 5.18,
      unitLabel: 'adet',
      quantity: 0,
      min: 0,
      max: 100,
      step: 10,
    },
    {
      id: 'tampon-mini',
      name: 'Mini Tampon',
      description: 'Hafif akışlı günler için mini tampon.',
      category: 'tampons',
      price: 9.87,
      unitLabel: 'adet',
      quantity: 10,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'tampon-standard',
      name: 'Standart Tampon',
      description: 'Standart emicilikte tampon.',
      category: 'tampons',
      price: 10.35,
      unitLabel: 'adet',
      quantity: 0,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'tampon-super',
      name: 'Süper Tampon',
      description: 'Yoğun günler için yüksek emicilik.',
      category: 'tampons',
      price: 10.88,
      unitLabel: 'adet',
      quantity: 0,
      min: 0,
      max: 60,
      step: 10,
    },
    {
      id: 'heat-pack-duo',
      name: "2'li Paket Isı Bandı",
      description: 'Kas ve regl ağrılarına iyi gelen ısı bandı.',
      category: 'support',
      price: 89.5,
      unitLabel: 'paket',
      quantity: 1,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'heat-pack-quad',
      name: "4'lü Paket Isı Bandı",
      description: 'Daha uzun süreli kullanım için 4 adet paket.',
      category: 'support',
      price: 187.5,
      unitLabel: 'paket',
      quantity: 2,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'cycle-essentials',
      name: 'beije Cycle Essentials',
      description: 'İki aylık döngüye yetecek miktarda 32 kapsüllük paket.',
      category: 'support',
      price: 440,
      unitLabel: 'adet',
      quantity: 2,
      min: 0,
      max: 10,
      step: 1,
    },
    {
      id: 'cranberry-essentials',
      name: 'beije Cranberry Essentials',
      description: 'Vejetaryen cranberry destek kapsülleri.',
      category: 'support',
      price: 345,
      unitLabel: 'adet',
      quantity: 2,
      min: 0,
      max: 10,
      step: 1,
    },
  ],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const slice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (!item) {
        return;
      }

      const clamped = clamp(
        Math.round(action.payload.quantity / item.step) * item.step,
        item.min,
        item.max
      );

      item.quantity = clamped;
    },
  },
});

export const { updateQuantity } = slice.actions;
export default slice.reducer;
export { initialState };