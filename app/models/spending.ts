export interface Spending {
  id: number;
  secureId: string;
  periodId: number | string;
  classificationId: number | string;
  userId?: number | string;
  description: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  classification?: {
    id: number;
    secureId: string;
    name: string;
    color?: string;
    userId: number | string;
  };
}

export interface CreateSpendingDto {
  periodId: string;
  classificationId: string;
  description: string;
  amount: number;
}

export interface UpdateSpendingDto {
  description?: string;
  amount?: number;
  classificationId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}