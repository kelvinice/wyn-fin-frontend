import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/auth/login": {};
  "/auth/register": {};
  "/dashboard": {};
  "/test": {};
  "/*": {
    "*": string;
  };
};