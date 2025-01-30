import type { API } from "./diseño.ts";

const get = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${import.meta.env.VITE_API_TOKEN}`,
    },
  });

  const json = await response.json();

  return json;
};

export const RestAPI: API = {
  get,
};
