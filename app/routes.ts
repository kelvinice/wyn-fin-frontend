import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Use the dashboard component as your index route
    index("routes/home.tsx"),
    
    // Define other routes
    route("auth/login", "routes/login.tsx"),
    route("auth/register", "routes/register.tsx"),
    
    // Keep dashboard as a named route but with a unique ID
    route("dashboard", "routes/dashboard.tsx", { id: "dashboard-route" }),
    
    route("test", "routes/test.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
