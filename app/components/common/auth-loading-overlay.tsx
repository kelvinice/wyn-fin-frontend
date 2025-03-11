import { useAuthCookie } from '~/components/auth/components/auth-cookie-context';

export function AuthLoadingOverlay({ children }: { children: React.ReactNode }) {
  const { isLoading, hasCheckedCookies } = useAuthCookie();

  if (isLoading && !hasCheckedCookies) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-base-100 rounded-lg shadow-xl p-6 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="font-medium">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}