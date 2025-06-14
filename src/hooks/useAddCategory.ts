// src/hooks/useAddCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; // Your Axios instance

interface CategoryPayload {
  name: string;
  type: "income" | "expense";
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryPayload) => api.post("/api/categories/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // if you're caching
    },
  });
}
