'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  createCategory, 
  updateCategory, 
  getCategoryById, 
  searchCategories,
  Category,
  CategorySearchParams
} from '@/lib/api/categories';
import { useToast } from '@/hooks/use-toast';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      updateCategory(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  // Get categories with search and pagination
  const useSearchCategories = (params: CategorySearchParams) => {
    return useQuery({
      queryKey: ['categories', params],
      queryFn: () => searchCategories(params),
    });
  };

  // Get single category by ID
  const useCategory = (id: string) => {
    return useQuery({
      queryKey: ['category', id],
      queryFn: () => getCategoryById(id),
      enabled: !!id,
    });
  };

  return {
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    useSearchCategories,
    useCategory,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
  };
};