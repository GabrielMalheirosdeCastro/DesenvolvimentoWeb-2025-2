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
 * Detectar se uma URL é válida
 * @param url - URL para validar
 * @returns boolean indicando se a URL é válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detectar provedor de hospedagem pela URL
 * @param url - URL para analisar
 * @returns Nome do provedor detectado
 */
export function detectHostingProvider(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('vercel.app')) return 'Vercel';
    if (hostname.includes('netlify.app')) return 'Netlify';
    if (hostname.includes('github.io')) return 'GitHub Pages';
    if (hostname.includes('firebase.app') || hostname.includes('web.app')) return 'Firebase';
    if (hostname.includes('surge.sh')) return 'Surge';
    if (hostname.includes('pages.dev')) return 'Cloudflare Pages';

    return 'Provedor Personalizado';
  } catch {
    return 'URL Inválida';
  }
}

/**
 * Obter informações do navegador
 * @returns Informações do navegador atual
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome')) return 'Google Chrome';
  if (userAgent.includes('Edge')) return 'Microsoft Edge';
  if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
  if (userAgent.includes('Safari')) return 'Safari';

  return 'Navegador Desconhecido';
}

// Corrigindo a exportação para ser compatível com o SpaceGallery
export { cn as Xl };
