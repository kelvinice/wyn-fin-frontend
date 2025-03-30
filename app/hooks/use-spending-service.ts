import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '~/components/auth/components/auth-provider';
import SpendingService from '~/services/spending-service';
import type { Spending, CreateSpendingDto, UpdateSpendingDto } from '~/models/spending';
import { useSpendingServiceContext } from '~/components/services/service-provider';

export function useSpendingService() {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const contextSpendingService = useSpendingServiceContext();
  
  const getService = useCallback(() => {
    return new SpendingService(authToken);
  }, [authToken]);
  
  // Query hook for getting all spendings
  const useGetAllSpendings = () => {
    return useQuery({
      queryKey: ['spendings'],
      queryFn: async () => {
        return contextSpendingService.getAll();
      }
    });
  };
  
  // Query hook for getting spendings by period
  const useGetSpendingsByPeriod = (periodId: string | undefined) => {
    return useQuery({
      queryKey: ['spendings', 'period', periodId],
      queryFn: async () => {
        if (!periodId) return [];
        return contextSpendingService.getByPeriod(periodId);
      },
      enabled: !!periodId
    });
  };
  
  // Query hook for getting a single spending
  const useGetSpendingById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['spendings', id],
      queryFn: async () => {
        if (!id) return null;
        return contextSpendingService.getById(id);
      },
      enabled: !!id
    });
  };
  
  // Mutation hook for creating a spending
  const useCreateSpending = () => {
    return useMutation({
      mutationFn: (data: CreateSpendingDto) => {
        return contextSpendingService.create(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['spendings'] });
      }
    });
  };
  
  // Mutation hook for updating a spending
  const useUpdateSpending = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateSpendingDto }) => {
        return contextSpendingService.update(id, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['spendings'] });
        queryClient.invalidateQueries({ queryKey: ['spendings', variables.id] });
      }
    });
  };
  
  // Mutation hook for deleting a spending
  const useDeleteSpending = () => {
    return useMutation({
      mutationFn: (id: string) => {
        return contextSpendingService.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['spendings'] });
      }
    });
  };
  
  // Direct method access (for non-React Query use cases)
  const getAllSpendings = useCallback(async (): Promise<Spending[]> => {
    return contextSpendingService.getAll();
  }, [contextSpendingService]);
  
  const getSpendingsByPeriod = useCallback(async (periodId: string): Promise<Spending[]> => {
    return contextSpendingService.getByPeriod(periodId);
  }, [contextSpendingService]);
  
  const getSpending = useCallback(async (id: string): Promise<Spending> => {
    return contextSpendingService.getById(id);
  }, [contextSpendingService]);
  
  const createSpending = useCallback(async (data: CreateSpendingDto): Promise<Spending> => {
    return contextSpendingService.create(data);
  }, [contextSpendingService]);
  
  const updateSpending = useCallback(async (id: string, data: UpdateSpendingDto): Promise<Spending> => {
    return contextSpendingService.update(id, data);
  }, [contextSpendingService]);
  
  const deleteSpending = useCallback(async (id: string): Promise<void> => {
    return contextSpendingService.delete(id);
  }, [contextSpendingService]);
  
  return {
    // React Query hooks
    useGetAllSpendings,
    useGetSpendingsByPeriod,
    useGetSpendingById,
    useCreateSpending,
    useUpdateSpending,
    useDeleteSpending,
    
    // Direct method access
    getAllSpendings,
    getSpendingsByPeriod,
    getSpending,
    createSpending,
    updateSpending,
    deleteSpending
  };
}

// Export types from the models file for convenience
export type { Spending, CreateSpendingDto, UpdateSpendingDto } from '~/models/spending';