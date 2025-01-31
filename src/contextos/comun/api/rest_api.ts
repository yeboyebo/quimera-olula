import type { API } from "./diseño.ts";

const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(`http://localhost:8000${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  return json;
};

export const RestAPI: API = {
  get,
};
