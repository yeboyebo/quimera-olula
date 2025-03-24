import type { API } from "./diseño.ts";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8005";

const consulta = async <T>(method: string, url: string): Promise<T> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  return json;
};

const comando = async <T>(
  method: string,
  url: string,
  body?: Partial<T>
): Promise<void> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json;
};

const comandoPost = async <T>(
  method: string,
  url: string,
  body?: Partial<T>
): Promise<{ id: string }> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json;
};


export const RestAPI: API = {
  get: <T>(url: string) => consulta<T>("GET", url),
  post: <T>(url: string, body: T) => comandoPost<T>("POST", url, body),
  put: <T>(url: string, body: T) => comando<T>("PUT", url, body),
  patch: <T>(url: string, body: Partial<T>) => comando<T>("PATCH", url, body),
  delete: (url: string) => comando("DELETE", url),
};
