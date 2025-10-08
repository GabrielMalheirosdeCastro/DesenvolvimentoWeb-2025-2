import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Corrigindo a exportação para ser compatível com o SpaceGallery
export { cn as Xl };
