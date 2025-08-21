import { tokenAcceso } from "../../usuarios/login/infraestructura.ts";
import type { API } from "./diseño.ts";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const consulta = async <T>(
  method: string,
  url: string,
  msgError?: string
): Promise<T> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenAcceso.obtener() ?? ""}`,
    },
  });

  if ([401, 403].includes(response.status)) {
    window.location.href = "/login";
    return Promise.reject();
  }

  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    }
    return Promise.reject(error);
  }

  const json = await response.json();

  return json;
};


const comando = async <T, U>(
  method: string,
  url: string,
  body?: Partial<T>,
  msgError?: string
): Promise<U> => {
  const response = await fetch(`${BASE}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenAcceso.obtener() ?? ""}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  if ([401, 403].includes(response.status)) {
    window.location.href = "/login";
    return Promise.reject();
  }

  if (!response.ok) {
    const errorText = await response.text();
    const error = {
      nombre: msgError || `Error ${response.status}`,
      descripcion: errorText,
    }
    return Promise.reject(error);
  }
  const contentType = response.headers.get('content-type')!;
  console.log(`Content-Type: ${contentType}`);
  if (contentType.startsWith('text/plain')) {
    const text = await response.text();
    return { 'respuesta': text } as U;
  } else {
    const json = await response.json();

    return json;
  }
  const json = await response.json();

  return json;
};


export const RestAPI: API = {
  get: <T>(url: string, msgError?: string) => consulta<T>("GET", url, msgError),
  post: <T>(url: string, body: T, msgError?: string) => comando<T, { id: string }>("POST", url, body, msgError),
  put: <T>(url: string, body: T, msgError?: string) => comando<T, void>("PUT", url, body, msgError),
  patch: <T>(url: string, body: Partial<T>, msgError?: string) => comando<T, void>("PATCH", url, body, msgError),
  delete: (url: string, msgError?: string) => comando("DELETE", url, msgError),
};
