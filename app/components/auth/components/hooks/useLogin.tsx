// app/components/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import AuthService from "~/components/services/auth-service";
import type { SignInFormData } from "../../core/models";

export function useLogin() {
  const authService = new AuthService();
  
  return useMutation({
    mutationFn: (data: SignInFormData) => 
      authService.login(data)
        .then(response => {
          // Store the token in localStorage
          if (response.data?.token) {
            localStorage.setItem('auth_token', response.data.token);
          }
          return response.data;
        }),
  });
}