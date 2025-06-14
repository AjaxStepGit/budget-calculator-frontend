// src/hooks/useAddBudget.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface BudgetPayload {
  month: string;  // e.g. "2025-06-01"
  amount: number; // integer or decimal
}

export function useAddBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBudget: BudgetPayload) =>
      api.post("/api/budget/", newBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] }); // refetch
    },
  });
}
