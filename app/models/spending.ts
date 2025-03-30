// Define the Spending interface
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
  // Relationships
  classification?: {
    id: number;
    secureId: string;
    name: string;
    color?: string;
    userId: number | string;
  };
}

// DTO for creating a spending
export interface CreateSpendingDto {
  periodId: string;
  classificationId: string;
  description: string;
  amount: number;
}

// DTO for updating a spending
export interface UpdateSpendingDto {
  description?: string;
  amount?: number;
  classificationId?: string;
}

// Define response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}