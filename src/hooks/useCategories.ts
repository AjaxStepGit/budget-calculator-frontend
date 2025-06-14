// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  user: number;
}

interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

interface CategoryParams {
  type?: string;
  search?: string;
  ordering?: string;
  page?: number;
  limit ?: number;
  offset?: number;
}

export function useCategories(params: CategoryParams = {}) {
  return useQuery<CategoryResponse>({
    queryKey: ["categories", params],
    queryFn: async () => {
      const res = await api.get("/api/categories/", { params });
      return res.data;
    },
  });
}
