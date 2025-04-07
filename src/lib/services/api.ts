import { DEFAULT_HEADERS } from "./constants";

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const mergedOptions: RequestInit = { headers: DEFAULT_HEADERS, ...options };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.error || `API request failed with status ${response.status}`,
    );
    throw Object.assign(error, { status: response.status, data: errorData });
  }

  return await response.json();
}

export function buildUrl(
  baseURL: string,
  params: Record<string, string | undefined>,
) {
  const url = new URL(baseURL, window.location.origin);

  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.append(k, v);
  }

  return url.toString();
}
