import type { API } from "./diseño.ts";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8005";

const consulta = async <T>(
  method: string,
  url: string,
  msgError?: string
): Promise<T> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    }
    throw error;
  }

  const json = await response.json();

  return json;
};


const comando = async <T>(
  method: string,
  url: string,
  body?: Partial<T>,
  msgError?: string
): Promise<void> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    }
    throw error;
  }
  const json = await response.json();

  return json;
};

const comandoPost = async <T>(
  method: string,
  url: string,
  body?: Partial<T>,
  msgError?: string
): Promise<{ id: string }> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    }
    throw error;
  }
  const json = await response.json();
  return json;
};


export const RestAPI: API = {
  get: <T>(url: string, msgError?: string) => consulta<T>("GET", url, msgError),
  post: <T>(url: string, body: T, msgError?: string) => comandoPost<T>("POST", url, body, msgError),
  put: <T>(url: string, body: T, msgError?: string) => comando<T>("PUT", url, body, msgError),
  patch: <T>(url: string, body: Partial<T>, msgError?: string) => comando<T>("PATCH", url, body, msgError),
  delete: (url: string, msgError?: string) => comando("DELETE", url, msgError),
};
