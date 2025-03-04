import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/about": {};
  "/auth/login": {};
  "/auth/register": {};
  "/test": {};
  "/dashboard": {};
  "/profile": {};
  "/settings": {};
  "/budget": {};
  "/spending": {};
  "/categories": {};
  "/api/ping": {};
  "/api/set-theme": {};
  "/api/auth/set-session": {};
  "/api/auth/clear-session": {};
  "/*": {
    "*": string;
  };
};