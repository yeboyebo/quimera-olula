import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { metaNuevoAsientoManual, nuevoAsientoManualVacio } from "../../dominio.ts";
import { postAsientoManual } from "../../infraestructura.ts";
import { EditorPartidasManual } from "../comun/EditorPartidasManual.tsx";

export const CrearAsientoManual = ({
    publicar,
    ejercicioId,
}: {
    publicar: EmitirEvento;
    ejercicioId: string;
}) => {
    const inicial = useMemo(() => nuevoAsientoManualVacio(ejercicioId), [ejercicioId]);
    const { modelo, set, valido } = useModelo(metaNuevoAsientoManual, inicial);

    const crear_ = useCallback(async () => {
        const { id } = await postAsientoManual(modelo);
        publicar("asiento_creado", id);
    }, [modelo, publicar]);

    const cancelar_ = useCallback(() => publicar("alta_de_asiento_cancelada"), [publicar]);

    const [crear, cancelar, aceptando] = useForm(crear_, cancelar_);
    const focus = useFocus();

    return (
        <QModal abierto={true} nombre="crearAsientoManual" titulo="Nuevo asiento manual" onCerrar={cancelar}>
            <quimera-formulario>
                <QInput label="Ejercicio" nombre="ejercicioId" valor={modelo.ejercicioId} soloLectura />
                <QInput
                    label="Fecha"
                    nombre="fecha"
                    tipo="fecha"
                    valor={modelo.fecha.toISOString().slice(0, 10)}
                    onChange={(v) => set({ ...modelo, fecha: new Date(`${v}T12:00:00`) })}
                    ref={focus}
                />
                <QInput
                    label="Concepto"
                    nombre="concepto"
                    valor={modelo.concepto}
                    onChange={(v) => set({ ...modelo, concepto: v })}
                />
            </quimera-formulario>
            <EditorPartidasManual
                partidas={modelo.partidas}
                ejercicioId={modelo.ejercicioId}
                onChange={(partidas) => set({ ...modelo, partidas })}
            />
            <div className="botones maestro-botones">
                <QBoton onClick={crear} deshabilitado={!valido || aceptando}>
                    Crear asiento
                </QBoton>
            </div>
        </QModal>
    );
};
