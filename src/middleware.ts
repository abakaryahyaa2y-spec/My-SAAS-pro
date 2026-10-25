import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. RATE LIMITING CÔTÉ SERVEUR (Anti-Brute Force & DoS)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  // Limite stricte sur les routes d'authentification (10 req/min)
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    const limiter = rateLimit(`auth:${clientIp}`, { windowMs: 60 * 1000, max: 10 });
    if (!limiter.success) {
      return new NextResponse('Trop de tentatives. Veuillez patienter avant de réessayer.', {
        status: 429,
        headers: {
          'Retry-After': String(limiter.reset),
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
  }

  // Limite globale sur le reste de l'application (120 req/min)
  const globalLimiter = rateLimit(`global:${clientIp}`, { windowMs: 60 * 1000, max: 120 });
  if (!globalLimiter.success) {
    return new NextResponse('Trop de requêtes. Veuillez patienter.', {
      status: 429,
      headers: { 'Retry-After': String(globalLimiter.reset) },
    });
  }

  // 2. GESTION DES SESSIONS VIA SUPABASE SSR
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edusaas-demo.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  // Récupération de l'utilisateur Supabase uniquement si de véritables clés sont configurées
  let user = null;
  const hasValidSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('demo');

  if (hasValidSupabase) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Erreur de connexion Supabase tolérée
    }
  }

  // Support de l'authentification serveur (cookies)
  const isDemoAuthenticated = request.cookies.get('edusaas_demo_auth')?.value === 'true';
  const isDemoEmailVerified = request.cookies.get('edusaas_demo_email_verified')?.value !== 'false';

  const isAuthenticated = !!user || isDemoAuthenticated;
  const isEmailVerified = user ? !!user.email_confirmed_at : isDemoEmailVerified;

  // 3. CONTRÔLE D'ACCÈS AUX ROUTES PROTÉGÉES (/dashboard/*)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 4. VÉRIFICATION D'EMAIL ACTIVÉE
    if (!isEmailVerified && pathname !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }

  // Redirection des utilisateurs déjà connectés et vérifiés vers le dashboard s'ils visitent login/register
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated && isEmailVerified) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Exclure les assets statiques, images et service workers :
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*).*)',
  ],
};
