import { QCargando } from "@olula/componentes/atomos/qcargando.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { importarFicheroFactura } from "../../infraestructura.ts";

export const CargarFichero = ({ publicar }: { publicar: EmitirEvento }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { intentar } = useContext(ContextoError);
    const [cargando, setCargando] = useState(false);

    const onFicheroSeleccionado = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const fichero = e.target.files?.[0];
            if (!fichero) return;
            setCargando(true);
            await intentar(
                async () => {
                    const id = await importarFicheroFactura(fichero);
                    publicar("factura_importada", id);
                },
                () => {
                    setCargando(false);
                    publicar("carga_fichero_cancelada");
                }
            );
            setCargando(false);
        },
        [intentar, publicar]
    );

    useEffect(() => {
        const input = inputRef.current!;
        input.click();

        const onCancel = () => publicar("carga_fichero_cancelada");
        input.addEventListener("cancel", onCancel);
        return () => input.removeEventListener("cancel", onCancel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={onFicheroSeleccionado}
            />
            <QCargando visible={cargando} mensaje="Procesando fichero..." />
        </>
    );
};
