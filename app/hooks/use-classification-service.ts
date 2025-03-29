import { useState, useCallback } from "react";
import { useAuthToken } from "~/components/auth/components/auth-provider";
import BaseService from "~/services/base-service";

interface Classification {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateClassificationDto {
  name: string;
  color?: string;
}

interface UpdateClassificationDto {
  name?: string;
  color?: string;
}

export function useClassificationService() {
  const authToken = useAuthToken();
  const [error, setError] = useState<Error | null>(null);
  
  const getService = useCallback(() => {
    return new BaseService(authToken);
  }, [authToken]);
  
  // Get all classifications for the current user
  const getAllClassifications = async (): Promise<Classification[]> => {
    try {
      const service = getService();
      const response = await service._axios.get('/classifications');
      
      // Make sure to extract the classifications array properly
      // Most API responses nest data in a 'data' property
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Get a single classification by ID
  const getClassification = async (id: string): Promise<Classification> => {
    try {
      const service = getService();
      const response = await service._axios.get(`/classifications/${id}`);
      return response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Create a new classification
  const createClassification = async (data: CreateClassificationDto): Promise<Classification> => {
    try {
      const service = getService();
      const response = await service._axios.post('/classifications', data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Update an existing classification
  const updateClassification = async (id: string, data: UpdateClassificationDto): Promise<Classification> => {
    try {
      const service = getService();
      const response = await service._axios.patch(`/classifications/${id}`, data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Delete a classification
  const deleteClassification = async (id: string): Promise<void> => {
    try {
      const service = getService();
      await service._axios.delete(`/classifications/${id}`);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  return {
    getAllClassifications,
    getClassification,
    createClassification,
    updateClassification,
    deleteClassification,
    error
  };
}

// Also export the Classification type for convenience
export type { Classification };