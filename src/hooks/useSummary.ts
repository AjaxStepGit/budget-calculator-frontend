// src/hooks/useSummary.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface SummaryResponse {
  total_income: number;
  total_expense: number;
  balance: number;
  filtered_from: string | null;
  filtered_to: string | null;
  budget: any | null;
  recent_transactions: any[] | null;
}

export function useSummary(start?: string, end?: string) {
  return useQuery<SummaryResponse>({
    queryKey: ["summary", start, end],
    queryFn: async () => {
      const res = await api.get("/api/summary/", {
        params: start && end ? { start, end } : {},
      });
      return res.data;
    },
  });
}
