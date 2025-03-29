
import { authTokenCookie } from '~/cookies.server';
import type { Route } from '../+types/ping';

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);
  
  return JSON.stringify({
    token: token || null
  });
}