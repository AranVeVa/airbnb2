const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { headers, ...restOptions } = options;

    const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    console.log(`Fetching from API: ${API_URL}${apiEndpoint}`); // <-- Log para depuración
    const response = await fetch(`${API_URL}${apiEndpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...restOptions,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Error status: ${response.status}`;

        // Si el token es inválido o expiró, limpiar sesión local para desbloquear al usuario
        if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined' && (errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('expirado') || errorMessage.toLowerCase().includes('acceso denegado'))) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }
        }

        throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
}