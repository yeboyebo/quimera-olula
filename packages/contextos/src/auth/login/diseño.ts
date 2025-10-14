import { Entidad } from "@olula/lib/diseño.ts";

export interface UsuarioLogin extends Entidad {
    tokenAcceso: string;
    tokenRefresco: string;
};

export interface UsuarioRefresco extends Entidad {
    tokenAcceso: string;
};

export type Login = (id: string, contraseña: string) => Promise<UsuarioLogin>;
export type Logout = (tokenRefresco: string) => Promise<void>;
export type RefrescarToken = (tokenRefresco: string) => Promise<UsuarioRefresco>;
