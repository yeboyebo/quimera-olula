export type API = {
  get: <T>(url: string) => Promise<T>;
  post: <T>(url: string, body: T) => Promise<{ id: string }>;
  put: <T>(url: string, body: T) => Promise<void>;
  patch: <T>(url: string, body: Partial<T>) => Promise<void>;
  delete: (url: string) => Promise<void>;
};
