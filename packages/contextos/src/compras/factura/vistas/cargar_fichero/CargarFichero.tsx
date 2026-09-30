import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback, useState } from "react";
import { importarFicheroFactura } from "../../infraestructura.ts";

export const CargarFichero = ({ publicar }: { publicar: EmitirEvento }) => {
    const [fichero, setFichero] = useState<File | null>(null);

    const onFicheroSeleccionado = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFichero(e.target.files?.[0] ?? null);
        },
        []
    );

    const importar_ = useCallback(async () => {
        const id = await importarFicheroFactura(fichero!);
        publicar("factura_importada", id);
    }, [fichero, publicar]);

    const cancelar_ = useCallback(
        () => publicar("carga_fichero_cancelada"),
        [publicar]
    );

    const [importar, cancelar, importando] = useForm(importar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cargarFicheroFactura"
            titulo="Cargar fichero de factura"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Fichero de la factura</label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={onFicheroSeleccionado}
                    />
                </div>
            </quimera-formulario>

            <div className="botones maestro-botones">
                <QBoton onClick={importar} deshabilitado={!fichero || importando}>
                    {importando ? "Cargando..." : "Cargar"}
                </QBoton>
            </div>
        </QModal>
    );
};
