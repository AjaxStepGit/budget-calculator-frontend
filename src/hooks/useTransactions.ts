// src/hooks/useTransactions.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface Transaction {
  id: number;
  amount: string;
  date: string;
  description: string;
  created_at: string;
  category: number;
  user: number;
}

interface TransactionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

interface QueryParams {
  category?: number;
  date?: string;
  amount__gte?: number;
  amount__lte?: number;
  ordering?: string;
  search?: string;
  page?: number;
  limit?: number;
  offset ?: number;
}

export function useTransactions(params: QueryParams = {}) {
  return useQuery<TransactionResponse>({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const res = await api.get("/api/transactions/", { params });
      return res.data;
    },
  });
}
