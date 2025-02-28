import { useMutation } from "@tanstack/react-query";

import AuthService from "~/components/services/auth-service";
import type { RegisterFormData } from "../../core/models";

export function useRegister() {
  const authService = new AuthService();
  
  return useMutation({
    mutationFn: (data: RegisterFormData) => 
      authService.register(data)
        .then(response => response.data),
  });
}