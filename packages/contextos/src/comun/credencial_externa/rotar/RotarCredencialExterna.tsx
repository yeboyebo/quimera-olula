import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback, useState } from "react";
import { CamposSecreto } from "../componentes/CamposSecreto.js";
import { secretoCompleto } from "../dominio.js";
import { CredencialExterna, SecretoCredencialExterna } from "../diseño.js";
import { rotarSecretoCredencialExterna } from "../infraestructura.js";
import "./RotarCredencialExterna.css";

/**
 * Modal de rotación del secreto de una credencial ya existente. No reutiliza
 * el auto-guardado de la tab General porque el secreto nunca llega desde la
 * API (ver diseño.ts) — es un flujo de escritura explícito y aislado.
 */
export const RotarCredencialExterna = ({
    publicar,
    credencial,
}: {
    credencial: CredencialExterna;
    publicar: EmitirEvento;
}) => {
    const [secreto, setSecreto] = useState<SecretoCredencialExterna>({});

    const rotar_ = useCallback(
        async () => {
            await rotarSecretoCredencialExterna(credencial.id, secreto);
            publicar("credencial_externa_rotada");
        },
        [credencial.id, secreto, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("rotacion_cancelada"),
        [publicar]
    );

    const [rotar, cancelar] = useForm(rotar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="rotarCredencialExterna"
            titulo={`Rotar credencial "${credencial.nombre}"`}
            onCerrar={cancelar}
        >
            <div className="RotarCredencialExterna">
                <p>
                    Introduce el nuevo valor del secreto. El valor anterior se
                    sobrescribirá y no podrá recuperarse.
                </p>
                <quimera-formulario>
                    <CamposSecreto
                        proveedor={credencial.proveedor}
                        tipoAuth={credencial.tipoAuth}
                        valor={secreto}
                        onChange={setSecreto}
                    />
                </quimera-formulario>

                <div className="botones maestro-botones">
                    <QBoton
                        onClick={rotar}
                        deshabilitado={!secretoCompleto(credencial.proveedor, credencial.tipoAuth, secreto)}
                    >
                        Rotar credencial
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
