import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // Public routes with shared layout
  layout("routes/layouts/public-root-layout.tsx", [
    // Homepage as index route
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("test", "routes/test.tsx"),
  ]),
  
  // Auth routes with shared layout
  layout("routes/auth/layout.tsx", [
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),
  ]),
  
  // Dashboard and profile section
  layout("routes/layouts/app-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx", { id: "dashboard-route" }),
    route("profile", "routes/profile.tsx"),
    route("settings", "routes/settings.tsx"),
    
    // Finances section with prefix
    ...prefix("budget", [
      index("routes/budget/index.tsx"),
      // route(":id", "routes/budget/[id].tsx"),
    ]),
    
    ...prefix("spending", [
      index("routes/spending/index.tsx"), 
      
      // route("new", "routes/spending/new.tsx"),
      // route(":id", "routes/spending/[id].tsx"),
    ]),
    
    ...prefix("categories", [
      index("routes/categories/index.tsx"),
      // route(":type", "routes/categories/[type].tsx"),
    ]),
    
    ...prefix("periods", [
      index("routes/periods/index.tsx"),
    ]),

    ...prefix("classifications", [
      index("routes/classifications/index.tsx"),
      // route(":id", "routes/classifications/[id].tsx"),
    ]),
    
    // route("accounts/connect", "routes/accounts/connect.tsx"),
  ]),
  
  // API Routes
  ...prefix("api", [
    route("ping", "routes/api/ping.tsx"),
    route("set-theme", "routes/api/set-theme.tsx"),
    
    // Nested API routes for auth
    ...prefix("auth", [
      route("set-session", "routes/api/auth/set-session.tsx"),
      route("clear-session", "routes/api/auth/clear-session.tsx"),
      route("refresh-token", "routes/api/auth/refresh-token.tsx"),
    ]),
  ]),
  
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;