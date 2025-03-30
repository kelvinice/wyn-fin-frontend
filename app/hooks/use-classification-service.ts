import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '~/components/auth/components/auth-provider';
import ClassificationService from '~/services/classification-service';
import type { Classification, CreateClassificationDto, UpdateClassificationDto } from '~/models/classification';
import { useClassificationServiceContext } from '~/components/services/service-provider';

export function useClassificationService() {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const contextClassificationService = useClassificationServiceContext();
  
  const getService = useCallback(() => {
    return new ClassificationService(authToken);
  }, [authToken]);
  
  // Query hook for getting all classifications
  const useGetAllClassifications = () => {
    return useQuery({
      queryKey: ['classifications'],
      queryFn: async () => {
        return contextClassificationService.getAll();
      }
    });
  };
  
  // Query hook for getting a single classification
  const useGetClassificationById = (id: string | undefined) => {
    return useQuery({
      queryKey: ['classifications', id],
      queryFn: async () => {
        if (!id) return null;
        return contextClassificationService.getById(id);
      },
      enabled: !!id
    });
  };
  
  // Mutation hook for creating a classification
  const useCreateClassification = () => {
    return useMutation({
      mutationFn: (data: CreateClassificationDto) => {
        return contextClassificationService.create(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['classifications'] });
      }
    });
  };
  
  // Mutation hook for updating a classification
  const useUpdateClassification = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateClassificationDto }) => {
        return contextClassificationService.update(id, data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['classifications'] });
        queryClient.invalidateQueries({ queryKey: ['classifications', variables.id] });
      }
    });
  };
  
  // Mutation hook for deleting a classification
  const useDeleteClassification = () => {
    return useMutation({
      mutationFn: (id: string) => {
        return contextClassificationService.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['classifications'] });
      }
    });
  };
  
  // Direct method access (for non-React Query use cases)
  const getAllClassifications = useCallback(async (): Promise<Classification[]> => {
    return contextClassificationService.getAll();
  }, [contextClassificationService]);
  
  const getClassification = useCallback(async (id: string): Promise<Classification> => {
    return contextClassificationService.getById(id);
  }, [contextClassificationService]);
  
  const createClassification = useCallback(async (data: CreateClassificationDto): Promise<Classification> => {
    return contextClassificationService.create(data);
  }, [contextClassificationService]);
  
  const updateClassification = useCallback(async (id: string, data: UpdateClassificationDto): Promise<Classification> => {
    return contextClassificationService.update(id, data);
  }, [contextClassificationService]);
  
  const deleteClassification = useCallback(async (id: string): Promise<void> => {
    return contextClassificationService.delete(id);
  }, [contextClassificationService]);
  
  return {
    // React Query hooks
    useGetAllClassifications,
    useGetClassificationById,
    useCreateClassification,
    useUpdateClassification,
    useDeleteClassification,
    
    // Direct method access
    getAllClassifications,
    getClassification,
    createClassification,
    updateClassification,
    deleteClassification
  };
}

// Export types from the models file for convenience
export type { Classification, CreateClassificationDto, UpdateClassificationDto } from '~/models/classification';