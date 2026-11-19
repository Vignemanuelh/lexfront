export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const MAX_RAW_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 Mo (aligné sur lexback)
export const MAX_SESSION_MEDIA_BYTES = 3.5 * 1024 * 1024; // 3.5 Mo
export const MAX_SESSION_DATA_URL_LENGTH = 4.5 * 1024 * 1024; // ~4.5 Mio chars

export interface PendingMediaPayload {
  name: string;
  type: string;
  dataUrl: string;
  prompt?: string;
}

export type PrepareMediaResult =
  | { ok: true; payload: PendingMediaPayload }
  | { ok: false; error: string };

export function isAudioFile(file: File | Blob): boolean {
  if (file.type.startsWith("audio/")) return true;
  if (file instanceof File && /\.(ogg|oga|opus|mp3|wav|m4a|webm)$/i.test(file.name)) {
    return true;
  }
  return false;
}

export function isSupportedImageFile(file: File | Blob): boolean {
  if (ALLOWED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) return true;
  if (file instanceof File && /\.(png|jpe?g|webp)$/i.test(file.name)) {
    return true;
  }
  return false;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader indisponible"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Lecture média invalide"));
      }
    };
    reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Compresse et redimensionne une image via canvas HTML5.
 * Retourne le Data URL original si le canvas 2D n'est pas disponible (ex: jsdom).
 */
export async function compressImageToDataUrl(
  file: Blob,
  maxDimension = 1280,
  quality = 0.82
): Promise<{ dataUrl: string; mimeType: string }> {
  const rawDataUrl = await blobToDataUrl(file);
  if (typeof document === "undefined" || typeof Image === "undefined") {
    return { dataUrl: rawDataUrl, mimeType: file.type || "image/jpeg" };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ dataUrl: rawDataUrl, mimeType: file.type || "image/jpeg" });
          return;
        }

        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const targetMime = file.type === "image/png" ? "image/jpeg" : file.type || "image/jpeg";
        const compressed = canvas.toDataURL(
          ALLOWED_IMAGE_MIME_TYPES.has(targetMime) ? targetMime : "image/jpeg",
          quality
        );

        if (compressed && compressed.startsWith("data:image/")) {
          resolve({
            dataUrl: compressed.length < rawDataUrl.length ? compressed : rawDataUrl,
            mimeType:
              compressed.length < rawDataUrl.length
                ? ALLOWED_IMAGE_MIME_TYPES.has(targetMime)
                  ? targetMime
                  : "image/jpeg"
                : file.type || "image/jpeg",
          });
          return;
        }
      } catch {
        // Fallback vers le Data URL brut si canvas échoue
      }
      resolve({ dataUrl: rawDataUrl, mimeType: file.type || "image/jpeg" });
    };
    img.onerror = () => resolve({ dataUrl: rawDataUrl, mimeType: file.type || "image/jpeg" });
    img.src = rawDataUrl;
  });
}

/**
 * Valide et prépare un fichier image ou audio pour transfert via sessionStorage (/ -> /chat).
 */
export async function preparePendingMediaPayload(
  file: File | Blob,
  prompt = ""
): Promise<PrepareMediaResult> {
  const audio = isAudioFile(file);
  if (!audio && !isSupportedImageFile(file)) {
    return {
      ok: false,
      error: "Format non supporté. Veuillez joindre une capture d'écran (PNG, JPEG, WebP) ou une note vocale.",
    };
  }

  if (file.size > MAX_RAW_UPLOAD_BYTES) {
    return {
      ok: false,
      error: "Le fichier dépasse la taille maximale autorisée (20 Mo).",
    };
  }

  const defaultName = audio ? "note_vocale.webm" : "capture.png";
  const fileName = file instanceof File && file.name ? file.name : defaultName;

  try {
    let dataUrl: string;
    let mimeType = file.type || (audio ? "audio/webm" : "image/png");

    if (!audio && file.size > MAX_SESSION_MEDIA_BYTES) {
      const compressed = await compressImageToDataUrl(file, 1280, 0.8);
      dataUrl = compressed.dataUrl;
      mimeType = compressed.mimeType;
    } else {
      dataUrl = await blobToDataUrl(file);
    }

    if (dataUrl.length > MAX_SESSION_DATA_URL_LENGTH) {
      return {
        ok: false,
        error: "Ce fichier est encore trop volumineux pour être transféré depuis l'accueil. Essayez une capture plus légère.",
      };
    }

    return {
      ok: true,
      payload: {
        name: fileName,
        type: mimeType,
        dataUrl,
        prompt: prompt.trim(),
      },
    };
  } catch {
    return {
      ok: false,
      error: "Impossible de lire ce fichier. Veuillez réessayer.",
    };
  }
}

/**
 * Génère une miniature légère (<= 640px) pour conserver l'aperçu d'une image dans sessionStorage.
 */
export async function createPersistedImageThumbnail(file: Blob): Promise<string | undefined> {
  try {
    const { dataUrl } = await compressImageToDataUrl(file, 640, 0.72);
    if (dataUrl.length <= 512 * 1024) {
      return dataUrl;
    }
    const smaller = await compressImageToDataUrl(file, 420, 0.6);
    return smaller.dataUrl.length <= 512 * 1024 ? smaller.dataUrl : undefined;
  } catch {
    return undefined;
  }
}
