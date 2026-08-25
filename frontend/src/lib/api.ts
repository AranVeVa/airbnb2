const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Default to localhost if the environment variable is not set

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { headers, ...restOptions } = options;

    const apiEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    const response = await fetch(`${API_URL}${apiEndpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...restOptions,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // CORRECCIÓN: Tu backend devuelve { error: "..." }, no "message"
        throw new Error(errorData.error || `Error status: ${response.status}`);
    }

    return response.json() as Promise<T>;
}