import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Budget, CreateBudgetDto, UpdateBudgetDto } from '~/models/budget';
import { useBudgetServiceContext } from '~/components/services/service-provider';

export function useBudgetService() {
  const queryClient = useQueryClient();
  const contextBudgetService = useBudgetServiceContext();
  
  const useGetAllBudgets = () => {
    return useQuery({
      queryKey: ['budgets'],
      queryFn: async () => {
        return contextBudgetService.getAll();
      }
    });
  };
  
  const useGetBudgetsByPeriod = (periodId: string | undefined) => {
    return useQuery({
      queryKey: ['budgets', 'period', periodId],
      queryFn: async () => {
        if (!periodId) return [];
        return contextBudgetService.getByPeriod(periodId);
      },
      enabled: !!periodId
    });
  };
  
  const useGetBudgetById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['budgets', id],
      queryFn: async () => {
        if (!id) return null;
        return contextBudgetService.getById(id);
      },
      enabled: !!id
    });
  };
  
  const useCreateBudget = () => {
    return useMutation({
      mutationFn: (budgetData: CreateBudgetDto) => {
        return contextBudgetService.create(budgetData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      }
    });
  };
  
  const useUpdateBudget = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) => {
        return contextBudgetService.update(id, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
        queryClient.invalidateQueries({ queryKey: ['budgets', variables.id] });
      }
    });
  };
  
  const useDeleteBudget = () => {
    return useMutation({
      mutationFn: (id: string) => {
        return contextBudgetService.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      }
    });
  };

  const useCopyBudgets = () => {
    return useMutation({
      mutationFn: ({ sourcePeriodId, targetPeriodId }: { sourcePeriodId: string; targetPeriodId: string }) => {
        return contextBudgetService.copyBudgets(sourcePeriodId, targetPeriodId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      }
    });
  };
  
  const getAllBudgets = useCallback(async (): Promise<Budget[]> => {
    return contextBudgetService.getAll();
  }, [contextBudgetService]);
  
  const getBudgetsByPeriod = useCallback(async (periodId: string): Promise<Budget[]> => {
    return contextBudgetService.getByPeriod(periodId);
  }, [contextBudgetService]);
  
  const getBudget = useCallback(async (id: string): Promise<Budget> => {
    return contextBudgetService.getById(id);
  }, [contextBudgetService]);
  
  const createBudget = useCallback(async (data: CreateBudgetDto): Promise<Budget> => {
    return contextBudgetService.create(data);
  }, [contextBudgetService]);
  
  const updateBudget = useCallback(async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    return contextBudgetService.update(id, data);
  }, [contextBudgetService]);
  
  const deleteBudget = useCallback(async (id: string): Promise<void> => {
    return contextBudgetService.delete(id);
  }, [contextBudgetService]);
  
  return {
    useGetAllBudgets,
    useGetBudgetsByPeriod,
    useGetBudgetById,
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
    useCopyBudgets,
    
    getAllBudgets,
    getBudgetsByPeriod,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget
  };
}

// Export types from the models file for convenience
export type { Budget, CreateBudgetDto, UpdateBudgetDto } from '~/models/budget';