// Define the Budget interface
export interface Budget {
  id: number;
  secureId: string;
  periodId: number | string;
  classificationId: number | string;
  userId?: number | string;
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

// DTO for creating a budget
export interface CreateBudgetDto {
  periodId: string;
  classificationId: string;
  amount: number;
}

// DTO for updating a budget
export interface UpdateBudgetDto {
  amount: number;
}

// Define response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}