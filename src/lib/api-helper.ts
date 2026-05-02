import "server-only";
import { requireSessionUid } from "./auth-server";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

const BASE_URL = process.env.APP_URL || "http://localhost:3000";

async function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<URL> {
  const uid = await requireSessionUid();
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("userId", uid);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url;
}

export async function authenticatedFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {};
  const url = await buildUrl(endpoint, params);

  const res = await fetch(url.toString(), {
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

export async function authenticatedFetchArray<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T[]> {
  try {
    const { params, ...fetchOptions } = options || {};
    const url = await buildUrl(endpoint, params);

    const res = await fetch(url.toString(), fetchOptions);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function authenticatedFetchVoid(
  endpoint: string,
  options?: FetchOptions
): Promise<void> {
  const { params, ...fetchOptions } = options || {};
  const url = await buildUrl(endpoint, params);

  const res = await fetch(url.toString(), {
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
