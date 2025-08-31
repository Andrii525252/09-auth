import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { serverGetSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const response = NextResponse.next();

  if (!accessToken) {
    if (refreshToken) {
      const data = await serverGetSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          if (parsed.accessToken) {
            response.cookies.set('accessToken', parsed.accessToken, {
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            });
          }

          if (parsed.refreshToken) {
            response.cookies.set('refreshToken', parsed.refreshToken, {
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            });
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        if (isPrivateRoute) {
          return response;
        }
      }
    }

    if (isPublicRoute) {
      return response;
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (isPrivateRoute) {
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/notes/filter/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
