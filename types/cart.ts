export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId?: string;
  packSize?: number;
  packLabel?: string;
}