import { useMutation } from "@tanstack/react-query";

import type { RegisterFormData } from "../../core/models";
import AuthService from "~/services/auth-service";

export function useRegister() {
  const authService = new AuthService();
  
  return useMutation({
    mutationFn: (data: RegisterFormData) => 
      authService.register(data)
        .then(response => response.data),
  });
}