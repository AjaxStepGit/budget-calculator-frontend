// src/hooks/useDeleteTransaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/transactions/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
