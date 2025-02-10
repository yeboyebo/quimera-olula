import type { API } from "./diseño.ts";

const urlAPI = "http://localhost:8000";

const consulta = async <T>(method: string, url: string): Promise<T> => {
  const response = await fetch(`${urlAPI}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  return json;
};

const comando = async <T>(
  method: string,
  url: string,
  body?: Partial<T>
): Promise<void> => {
  await fetch(`${urlAPI}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
};

export const RestAPI: API = {
  get: <T>(url: string) => consulta<T>("GET", url),
  post: <T>(url: string, body: T) => comando<T>("POST", url, body),
  put: <T>(url: string, body: T) => comando<T>("PUT", url, body),
  patch: <T>(url: string, body: Partial<T>) => comando<T>("PATCH", url, body),
  delete: (url: string) => comando("DELETE", url),
};
