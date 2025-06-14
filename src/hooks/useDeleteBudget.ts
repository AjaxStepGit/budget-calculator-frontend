
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios"; 

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/budget/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
    },
  });
}
