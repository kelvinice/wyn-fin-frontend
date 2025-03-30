// Define the Classification interface
export interface Classification {
  id: number;
  secureId: string;
  name: string;
  color?: string;
  userId: number | string;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating a classification
export interface CreateClassificationDto {
  name: string;
  color?: string;
}

// DTO for updating a classification
export interface UpdateClassificationDto {
  name?: string;
  color?: string;
}

// Define response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}