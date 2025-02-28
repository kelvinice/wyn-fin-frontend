import { type RouteConfig, index, route,  } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/login.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
