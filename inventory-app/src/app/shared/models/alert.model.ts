export type AlertSeverity = 'LOW' | 'CRITICAL';

export interface StockAlert {
  productId: number;
  sku: string;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: AlertSeverity;
}
