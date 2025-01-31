export type API = {
  get: <T>(url: string) => Promise<T>;
};
