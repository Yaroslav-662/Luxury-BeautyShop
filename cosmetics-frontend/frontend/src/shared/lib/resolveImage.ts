// src/shared/lib/resolveImage.ts
import { API_URL } from "@/core/config/env";

/**
 * Повертає правильний URL зображення.
 * Для Cloudinary автоматично додає трансформації (resize, format, quality).
 */
export function resolveImage(src?: string, options?: {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "thumb" | "scale";
  quality?: number | "auto";
  format?: "auto" | "webp" | "jpg";
}): string {
  if (!src || src === "string" || src.trim() === "") {
    return "https://placehold.co/600x600?text=No+Image";
  }

  // Cloudinary URL — додаємо трансформації
  if (src.includes("res.cloudinary.com")) {
    const {
      width = 600,
      height = 600,
      crop = "fill",
      quality = "auto",
      format = "auto",
    } = options || {};

    // Вставляємо трансформації між /upload/ і версією/публічним ID
    // Формат: /upload/c_fill,w_600,h_600,q_auto,f_auto/v123/...
    const transform = `c_${crop},w_${width},h_${height},q_${quality},f_${format}`;

    return src.replace(
      /\/upload\//,
      `/upload/${transform}/`
    );
  }

  // Повний URL (не Cloudinary)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Відносний шлях з бекенда
  return `${API_URL}${src}`;
}

/**
 * Зручні пресети для різних контекстів
 */
export const resolveThumb = (src?: string) =>
  resolveImage(src, { width: 400, height: 400, crop: "fill", quality: "auto" });

export const resolveCard = (src?: string) =>
  resolveImage(src, { width: 600, height: 600, crop: "fill", quality: "auto" });

export const resolveGallery = (src?: string) =>
  resolveImage(src, { width: 900, height: 900, crop: "fit", quality: "auto" });
