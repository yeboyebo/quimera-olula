import { useEffect } from "react";
import { PlaidLinkOnExit, PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { ConectarProveedorBancarioProps } from "../diseño.js";

/**
 * Única pieza de la aplicación que importa `react-plaid-link`. Implementa el
 * contrato `ProveedorBancarioUI.Conectar` (ver ../diseño.ts) para Plaid:
 * `datos.link_token` es el token de un solo uso que devolvió
 * `POST tesoreria/conexion_bancaria/iniciar`.
 *
 * usePlaidLink necesita el link_token ANTES de poder llamar a open() (no
 * admite abrir con token null), así que se abre el overlay en cuanto `ready`
 * pasa a true (el script de Plaid ya cargó con ese token). onSuccess entrega
 * el public_token, que se traduce a `onCompletado({ public_token })`; onExit
 * (el usuario cierra el overlay sin terminar) se traduce a `onCancelado`.
 */
export const ConectarPlaid = ({
    datos,
    onCompletado,
    onCancelado,
}: ConectarProveedorBancarioProps) => {
    const linkToken = typeof datos.link_token === "string" ? datos.link_token : null;

    const onSuccess: PlaidLinkOnSuccess = (publicToken) => {
        if (!publicToken) {
            onCancelado();
            return;
        }
        onCompletado({ public_token: publicToken });
    };

    const onExit: PlaidLinkOnExit = () => {
        onCancelado();
    };

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
        onExit,
    });

    useEffect(() => {
        if (ready) open();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    return null;
};
