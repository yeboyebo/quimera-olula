import { RestAPI } from "../../comun/api/rest_api.ts";
import { Logout } from "../login/diseño.ts";


const baseUrl = '/auth';


export const logout: Logout = async (tokenRefresco: string) => {
    const payload = { token: tokenRefresco };
    RestAPI.post(`${baseUrl}/logout`, payload);
}
