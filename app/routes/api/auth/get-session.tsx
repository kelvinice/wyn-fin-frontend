import { authTokenCookie, userDataCookie, authExpirationCookie, refreshTokenCookie } from '~/cookies.server';
import type { Route } from '../+types/ping';

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);
  const userDataString = await userDataCookie.parse(cookieHeader);
  const expiration = await authExpirationCookie.parse(cookieHeader);
  const refreshToken = await refreshTokenCookie.parse(cookieHeader);
  
  let userData = null;
  if (userDataString) {
    try {
      userData = JSON.parse(userDataString);
    } catch (error) {
      console.error('Failed to parse user data:', error);
    }
  }
  
  return JSON.stringify({
    token: token || null,
    userData: userData,
    expiration: expiration || null,
    refreshToken: refreshToken || null,
  });
}