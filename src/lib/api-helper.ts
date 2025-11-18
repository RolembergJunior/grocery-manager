import "server-only";
import { auth } from "@/auth";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Helper function for authenticated API requests
 * Automatically handles session validation and common fetch patterns
 */
export async function authenticatedFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  // Build URL with query parameters
  const url = new URL(`${process.env.NEXTAUTH_URL}${endpoint}`);
  url.searchParams.set("userId", session.user.id);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const { params, ...fetchOptions } = options || {};

  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Helper for GET requests that return empty array on auth failure
 */
export async function authenticatedFetchArray<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const url = new URL(`${process.env.NEXTAUTH_URL}${endpoint}`);
    url.searchParams.set("userId", session.user.id);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const { params, ...fetchOptions } = options || {};

    const res = await fetch(url.toString(), {
      credentials: "include",
      ...fetchOptions,
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

/**
 * Helper for requests that may return void
 */
export async function authenticatedFetchVoid(
  endpoint: string,
  options?: FetchOptions
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const url = new URL(`${process.env.NEXTAUTH_URL}${endpoint}`);
  url.searchParams.set("userId", session.user.id);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const { params, ...fetchOptions } = options || {};

  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
}
