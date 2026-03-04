import { API_URL } from "@/core/config/env";

export function resolveImage(src?: string): string {
  if (!src) {
    return "https://placehold.co/600x600?text=No+Image";
  }

  // повний URL (Cloudinary, CDN)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // відносний шлях з бекенда (/uploads/...)
  return `${API_URL}${src}`;
}
