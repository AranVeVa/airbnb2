const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getImageUrl(path?: string): string {
    if (!path) return "https://via.placeholder.com/600x350"; // placeholder por defecto
    if (path.startsWith('http') || path.startsWith('/api')) return path;
    // Si es una ruta relativa, prependemos el API_URL
    return `${API_URL}${path}`;
}