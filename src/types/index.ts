import type { ImageSourcePropType } from 'react-native';

export type Category = 'electric' | 'road' | 'mountain' | 'helmet';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: ImageSourcePropType;
  category: Category;
  /** Small grey label shown above the name, e.g. "Road Bike". */
  label: string;
  description: string;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
