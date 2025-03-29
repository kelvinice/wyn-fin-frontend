// app/components/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import type { SignInFormData, AuthResponse } from "../../core/models";
import AuthService from "~/services/auth-service";
import { useSignIn } from "../auth-provider";

export function useLogin() {
  const authService = new AuthService();
  const signIn = useSignIn();
  
  return useMutation({
    mutationFn: async (data: SignInFormData): Promise<AuthResponse> => {
      const response = await authService.login(data);
      
      // Await the asynchronous signIn so cookies are set before moving on
      await signIn({
        token: response.token,
        user: response.user,
        expiresIn: response.expiresIn
      });
      
      return response;
    },
  });
}