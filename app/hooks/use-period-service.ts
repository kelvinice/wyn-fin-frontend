import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '~/components/auth/components/auth-provider';
import PeriodService from '~/services/period-service';
import type { Period } from '~/services/period-service';

export function usePeriodService() {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  
  const getService = useCallback(() => {
    return new PeriodService(authToken);
  }, [authToken]);

  // Query hook for getting all periods
  const useGetAllPeriods = () => {
    return useQuery({
      queryKey: ['periods'],
      queryFn: async () => {
        const service = getService();
        const data = await service.getAll();
        // Sort periods by year (descending) and then by month (descending)
        return data.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });
      }
    });
  };
  
  // Query hook for getting a single period
  const useGetPeriodById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['periods', id],
      queryFn: async () => {
        if (!id) return null;
        const service = getService();
        return service.getById(id);
      },
      enabled: !!id // Only run the query if we have an ID
    });
  };
  
  // Mutation hook for creating a period
  const useCreatePeriod = () => {
    return useMutation({
      mutationFn: async (periodData: { year: number; month: number }) => {
        const service = getService();
        return service.create(periodData);
      },
      onSuccess: () => {
        // Invalidate and refetch periods list after creating
        queryClient.invalidateQueries({ queryKey: ['periods'] });
      }
    });
  };
  
  // Mutation hook for updating a period
  const useUpdatePeriod = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: { year: number; month: number } }) => {
        const service = getService();
        return service.update(id, data);
      },
      onSuccess: () => {
        // Invalidate and refetch periods list after updating
        queryClient.invalidateQueries({ queryKey: ['periods'] });
      }
    });
  };
  
  // Mutation hook for deleting a period
  const useDeletePeriod = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const service = getService();
        return service.delete(id);
      },
      onSuccess: () => {
        // Invalidate and refetch periods list after deleting
        queryClient.invalidateQueries({ queryKey: ['periods'] });
      }
    });
  };
  
  // Direct method access (for components that don't want to use hooks)
  const getAllPeriods = useCallback(async () => {
    const service = getService();
    return service.getAll();
  }, [getService]);
  
  const getPeriodById = useCallback(async (id: string) => {
    const service = getService();
    return service.getById(id);
  }, [getService]);
  
  const createPeriod = useCallback(async (periodData: { year: number; month: number }) => {
    const service = getService();
    return service.create(periodData);
  }, [getService]);
  
  const updatePeriod = useCallback(async (id: string, periodData: { year: number; month: number }) => {
    const service = getService();
    return service.update(id, periodData);
  }, [getService]);
  
  const deletePeriod = useCallback(async (id: string) => {
    const service = getService();
    return service.delete(id);
  }, [getService]);
  
  return {
    // React Query hooks
    useGetAllPeriods,
    useGetPeriodById,
    useCreatePeriod,
    useUpdatePeriod,
    useDeletePeriod,
    
    // Direct method access
    getAllPeriods,
    getPeriodById,
    createPeriod,
    updatePeriod,
    deletePeriod
  };
}

// Also export the Period type for convenience
export type { Period } from '~/services/period-service';