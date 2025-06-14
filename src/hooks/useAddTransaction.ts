// src/hooks/useAddTransaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface TransactionPayload {
  category: number;
  amount: number;
  description: string;
}

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionPayload) => api.post("/api/transactions/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
