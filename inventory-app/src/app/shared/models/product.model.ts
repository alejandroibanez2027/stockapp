export interface Product {
  productId: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export interface ProductRequest {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
