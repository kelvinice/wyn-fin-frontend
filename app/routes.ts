import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/login.tsx"),
    route("auth/register", "routes/register.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("test", "routes/test.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
