import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/about": {};
  "/test": {};
  "/auth/login": {};
  "/auth/register": {};
  "/dashboard": {};
  "/profile": {};
  "/settings": {};
  "/budget": {};
  "/spending": {};
  "/categories": {};
  "/periods": {};
  "/classifications": {};
  "/api/ping": {};
  "/api/set-theme": {};
  "/api/auth/set-session": {};
  "/api/auth/clear-session": {};
  "/*": {
    "*": string;
  };
};