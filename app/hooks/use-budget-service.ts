import { useState, useCallback } from "react";
import { useAuthToken } from "~/components/auth/components/auth-provider";
import BaseService from "~/services/base-service";

interface Budget {
  id: string;
  periodId: string;
  classificationId: string;
  userId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  classification?: {
    id: string;
    name: string;
    color?: string;
  };
}

interface CreateBudgetDto {
  periodId: string;
  classificationId: string;
  amount: number;
}

interface UpdateBudgetDto {
  amount: number;
}

export function useBudgetService() {
  const authToken = useAuthToken();
  const [error, setError] = useState<Error | null>(null);
  
  const getService = useCallback(() => {
    return new BaseService(authToken);
  }, [authToken]);
  
  // Get all budgets
  const getAllBudgets = async (): Promise<Budget[]> => {
    try {
      const service = getService();
      const response = await service._axios.get('/budgets');
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Get budgets by period
  const getBudgetsByPeriod = async (periodId: string): Promise<Budget[]> => {
    try {
      const service = getService();
      const response = await service._axios.get(`/budgets?periodId=${periodId}`);
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Get a single budget by ID
  const getBudget = async (id: string): Promise<Budget> => {
    try {
      const service = getService();
      const response = await service._axios.get(`/budgets/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Create a new budget
  const createBudget = async (data: CreateBudgetDto): Promise<Budget> => {
    try {
      const service = getService();
      const response = await service._axios.post('/budgets', data);
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Update an existing budget
  const updateBudget = async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    try {
      const service = getService();
      const response = await service._axios.patch(`/budgets/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Delete a budget
  const deleteBudget = async (id: string): Promise<void> => {
    try {
      const service = getService();
      await service._axios.delete(`/budgets/${id}`);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  return {
    getAllBudgets,
    getBudgetsByPeriod,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    error
  };
}

export type { Budget, CreateBudgetDto, UpdateBudgetDto };