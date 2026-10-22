import { Asiento } from "#/contabilidad/asiento/diseño.ts";
import { getAsiento } from "#/contabilidad/asiento/infraestructura.ts";
import { PartidasAsientoLista } from "#/contabilidad/asiento/vistas/detalle/PartidasAsientoLista.tsx";
import { TabGeneralAsiento } from "#/contabilidad/asiento/vistas/detalle/TabGeneralAsiento.tsx";
import { useEffect, useState } from "react";

interface TabContabilidadProps {
    asientoId: string | null;
}

export const TabContabilidad = ({ asientoId }: TabContabilidadProps) => {
    const [asiento, setAsiento] = useState<Asiento | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!asientoId) {
            setAsiento(null);
            return;
        }
        setCargando(true);
        setError("");
        getAsiento(asientoId)
            .then(setAsiento)
            // El asiento puede haberse borrado desde contabilidad y devolver 404:
            // mejor un mensaje que una promesa rechazada sin gestionar.
            .catch(() => setError("No se ha podido cargar el asiento de esta factura."))
            .finally(() => setCargando(false));
    }, [asientoId]);

    if (!asientoId) {
        return <p>Esta factura todavía no está contabilizada.</p>;
    }

    if (cargando) return <p>Cargando asiento…</p>;
    if (error) return <p>{error}</p>;
    if (!asiento) return null;

    return (
        <div className="TabContabilidad">
            <TabGeneralAsiento asiento={asiento} />
            <PartidasAsientoLista partidas={asiento.partidas} />
        </div>
    );
};
