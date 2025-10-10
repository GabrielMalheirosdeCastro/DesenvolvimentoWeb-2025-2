import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para mesclagem de classes CSS de forma inteligente
 * Combina clsx para lógica condicional com tailwind-merge para deduplicação
 *
 * @param inputs - Classes CSS condicionais
 * @returns String de classes CSS otimizada
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detectar se uma URL é válida e acessível
 * @param url - URL para validar
 * @returns boolean indicando se a URL é válida
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Verificar se não é placeholder
    const placeholders = [
      "seu-portfolio",
      "localhost",
      "127.0.0.1",
      "example.com",
      "placeholder",
    ];
    const isPlaceholder = placeholders.some((placeholder) =>
      urlObj.hostname.includes(placeholder)
    );

    return !isPlaceholder && (urlObj.protocol === "https:" || urlObj.protocol === "http:");
  } catch {
    return false;
  }
}

/**
 * Detectar provedor de hospedagem pela URL de forma universal
 * @param url - URL para analisar
 * @returns Nome do provedor detectado
 */
export function detectHostingProvider(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Detecção universal de provedores
    if (hostname.includes("vercel.app") || hostname.includes("vercel.com"))
      return "Vercel";
    if (hostname.includes("netlify.app") || hostname.includes("netlify.com"))
      return "Netlify";
    if (hostname.includes("github.io")) return "GitHub Pages";
    if (hostname.includes("firebase.app") || hostname.includes("web.app"))
      return "Firebase";
    if (hostname.includes("surge.sh")) return "Surge";
    if (hostname.includes("heroku.app") || hostname.includes("herokuapp.com"))
      return "Heroku";
    if (hostname.includes("render.com")) return "Render";
    if (hostname.includes("railway.app")) return "Railway";
    if (hostname.includes("fly.io")) return "Fly.io";
    if (hostname.includes("pages.dev")) return "Cloudflare Pages";
    if (hostname.includes("amplify.app")) return "AWS Amplify";
    if (hostname.includes("azurewebsites.net")) return "Azure";

    // Domínios personalizados
    if (!hostname.includes(".app") && !hostname.includes("localhost")) {
      return "Domínio Próprio";
    }

    return "Provedor Personalizado";
  } catch {
    return "URL Inválida";
  }
}

/**
 * Obter informações do ambiente (Windows + Google)
 * @returns Informações do navegador e sistema
 */
export function getEnvironmentInfo() {
  const userAgent = navigator.userAgent;

  return {
    browser: userAgent.includes("Chrome") ? "Google Chrome" :
             userAgent.includes("Edge") ? "Microsoft Edge" :
             userAgent.includes("Firefox") ? "Mozilla Firefox" : "Outro",
    isWindows: userAgent.includes("Windows"),
    isGoogle: userAgent.includes("Chrome") || userAgent.includes("Chromium"),
    viewport: window.innerWidth < 768 ? "mobile" :
              window.innerWidth < 1024 ? "tablet" : "desktop"
  };
}
