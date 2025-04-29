import { Entidad } from "../../comun/diseño.ts";

export interface Usuario extends Entidad {
    id: string;
    superuser: boolean;
    token: string;
    email: string;
};
export interface ForgetPassWordResponse {
    message: string;
    result: boolean;
}
export type Login = (email: string, password: string) => Promise<Usuario>;
export type ForgetPassword = (email: string) => Promise<ForgetPassWordResponse>;