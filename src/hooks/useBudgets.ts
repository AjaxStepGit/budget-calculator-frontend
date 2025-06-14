// src/hooks/useBudgets.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Budget {
  id: number;
  month: string; // "YYYY-MM-DD"
  amount: string;
  user: number;
}

interface BudgetResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Budget[];
}

interface BudgetParams {
  month?: string;
  amount__gte?: number;
  amount__lte?: number;
  ordering?: string;
  page?: number;
  limit ?: number;
  offset ?: number;
}

export function useBudgets(params: BudgetParams = {}) {
  return useQuery<BudgetResponse>({
    queryKey: ["budgets", params],
    queryFn: async () => {
      const res = await api.get("/api/budget/", { params });
      return res.data;
    },
  });
}
