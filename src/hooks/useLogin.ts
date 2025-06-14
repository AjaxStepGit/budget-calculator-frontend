import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios"; // your configured Axios instance

interface LoginInput {
  username: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post("/api-token-auth/", data);
      return response.data; // { token: string }
    },
  });
}
