import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const selectDomain = (state: RootState) => state.package;

export const selectPackageItems = createSelector(
  [selectDomain],
  (state) => state.items
);


export const selectShipmentTotal = createSelector([selectPackageItems], (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);


export const selectSelectedQuantity = createSelector(
  [selectPackageItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);
