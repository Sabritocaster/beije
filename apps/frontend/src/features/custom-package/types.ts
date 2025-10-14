export type ProductCategory =
  | 'pads'
  | 'tampons'
  | 'liners'
  | 'support';


export interface PackageProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unitLabel: string;
  min: number;
  max: number;
  step: number;
}

export interface PackageItem extends PackageProduct {
  quantity: number;
}

export interface PackageState {
  items: PackageItem[];
}
