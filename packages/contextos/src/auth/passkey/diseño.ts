import { UsuarioLogin } from "../login/diseño.ts";

export type IniciarRegistro = (email: string) => Promise<unknown>;
export type FinalizarRegistro = (credential: string) => Promise<void>;
export type IniciarAutenticacion = () => Promise<unknown>;
export type FinalizarAutenticacion = (credential: string) => Promise<UsuarioLogin>;
