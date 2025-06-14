// src/hooks/useDeleteCategory.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // your Axios instance

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/categories/${id}/`),
    onSuccess: () => {
      // Invalidate category list on delete
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      console.error("Delete category failed:", err);
    },
  });
}
