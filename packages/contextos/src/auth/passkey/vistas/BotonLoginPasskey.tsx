import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { permisosGrupo, whoAmI, whoAmIStorage } from "../../login/infraestructura.ts";
import { autenticarConPasskey } from "../dominio.ts";

type Estado = "idle" | "cargando" | "error";

export const BotonLoginPasskey = () => {
    const navigate = useNavigate();
    const [estado, setEstado] = useState<Estado>("idle");

    const handleClick = async () => {
        setEstado("cargando");
        autenticarConPasskey()
            .then(() => whoAmI())
            .then((datosWhoAmI) => {
                whoAmIStorage.actualizar(datosWhoAmI);
                permisosGrupo.actualizar(datosWhoAmI.permisos);
            })
            .then(() => navigate("/"))
            .catch(() => setEstado("error"));
    };

    return (
        <div>
            <QBoton
                variante="borde"
                tamaño="mediano"
                onClick={handleClick}
                deshabilitado={estado === "cargando"}
            >
                {estado === "cargando" ? "Verificando..." : "Iniciar sesión con passkey"}
            </QBoton>
            {estado === "error" && (
                <p style={{ color: "var(--color-error, red)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                    No se pudo autenticar con passkey. Inténtalo de nuevo.
                </p>
            )}
        </div>
    );
};
