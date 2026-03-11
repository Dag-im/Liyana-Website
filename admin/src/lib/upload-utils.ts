const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

/**
 * Resolves a filename or path to a full serving URL.
 * If the path is already a full URL or blob URL, it returns it as is.
 */
export function getUploadUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  // The backend serves files at /uploads/:filename
  // We assume the filename is stored in the database
  return `${API_BASE_URL}/uploads/${path}`;
}
