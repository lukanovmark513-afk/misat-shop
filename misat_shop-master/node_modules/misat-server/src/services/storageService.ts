// client/src/services/storageService.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];  // ← меняем image на массив images
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  stock: number;
  created_at: string;
}