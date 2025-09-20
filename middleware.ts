import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const path = request.nextUrl.pathname;

  // Verificar autenticación de Supabase
  const accessToken = request.cookies.get("sb-access-token")?.value;
  const refreshToken = request.cookies.get("sb-refresh-token")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);

  // Redirigir la página principal a login siempre
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Rutas públicas que no requieren autenticación
  const isPublicPath = path === "/login" || path === "/register";

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si está autenticado y trata de acceder a login/register
  if (isAuthenticated && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Permitir continuar con la petición
  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Ejecutar middleware en todas las rutas excepto:
     * - API routes (empiezan con /api/)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
