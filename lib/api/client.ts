const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// The backend's root origin (API_BASE_URL minus the /api/v1 suffix) - used to
// resolve relative paths like "/media/uploads/x.png" returned by the image
// upload endpoint, which live outside the /api/v1 prefix.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("/") ? `${API_ORIGIN}${url}` : url;
}

export class ApiError extends Error {
  status: number;
  code: string;
  detail: string | unknown[];

  constructor(status: number, code: string, detail: string | unknown[]) {
    super(typeof detail === "string" ? detail : code);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  // Let the browser set Content-Type (with the multipart boundary) itself
  // when uploading a FormData body - overriding it breaks the request.
  const isFormData = rest.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    let code = "unknown_error";
    let detail: string | unknown[] = res.statusText;
    try {
      const body = await res.json();
      code = body.code ?? code;
      detail = body.detail ?? detail;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, code, detail);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
