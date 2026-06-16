export interface Movement {
  movementId: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface MovementRequest {
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}
