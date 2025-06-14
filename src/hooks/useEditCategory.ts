// src/hooks/useEditCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // Your configured Axios instance

interface CategoryUpdatePayload {
  id: number;
  name: string;
  type: "income" | "expense";
}

export function useEditCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: CategoryUpdatePayload) =>
      api.patch(`/api/categories/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
