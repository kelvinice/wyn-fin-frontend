import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "./components/common/theme-context";
import { ToastProvider } from "./components/common/toast-context";
import { AuthProvider } from "./components/auth/components/auth-provider";
import { themeCookie, authTokenCookie, userDataCookie } from "./cookies.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Add loader to get theme and auth data from cookies
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  
  // Get theme from cookie
  const themeCookieData = await themeCookie.parse(cookieHeader) || {};
  
  // Get auth data from cookies
  const tokenData = await authTokenCookie.parse(cookieHeader);
  const userData = await userDataCookie.parse(cookieHeader);
  
  let parsedUserData = null;
  if (userData) {
    try {
      parsedUserData = JSON.parse(userData);
    } catch (e) {
      console.error("Failed to parse user data from cookie:", e);
    }
  }
  
  // Instead of using json() helper, return a Response with JSON directly
  return new Response(JSON.stringify({
    theme: themeCookieData.theme || "light",
    isAuthenticated: !!tokenData && !!userData,
    user: parsedUserData,
    token: tokenData
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  // Add state to track hydration
  const [isHydrated, setIsHydrated] = useState(false);

  // Once the component mounts on client, mark as hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const loaderData = useLoaderData<typeof loader>();
  
  // Safely handle potential undefined values
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider 
        initialAuthState={{
          token: loaderData?.token || null,
          user: loaderData?.user || null,
          isAuthenticated: Boolean(loaderData?.token && loaderData?.user)
        }}
      >
        <ThemeProvider initialTheme={(loaderData?.theme as "light" | "dark") || "light"}>
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}