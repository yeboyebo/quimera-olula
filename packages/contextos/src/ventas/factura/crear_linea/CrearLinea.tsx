import { ArticuloLinea, CamposArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import {
    camposConCambiosServidor,
    metaNuevaLinea,
    ModeloNuevaLinea,
    nuevaLineaInicial,
} from "./dominio.ts";

export const CrearLinea = ({
  facturaId,
  publicar,
}: {
  facturaId: string;
  publicar: ProcesarEvento;
}) => {
    const onModeloListo = useCallback(
        async (nuevaLinea: ModeloNuevaLinea, campo?: string) => {
            if (campo && !(camposConCambiosServidor as readonly string[]).includes(campo)) return;
            return await postLinea(facturaId, nuevaLinea, { dryRun: true });
        },
        [facturaId]
    );

    const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaInicial, onModeloListo);
    const linea = lineaArticulo.modelo;

    const onArticuloCambiado = useCallback(
        async (cambios: Partial<CamposArticuloLinea>) => {
            const { idArticulo, ...restCambios } = cambios;
            const cambiosModelo = {
                ...restCambios,
                ...(idArticulo !== undefined ? { idArticulo, pvpUnitario: null } : {}),
            };
            lineaArticulo.set({ ...linea, ...cambiosModelo });
        },
        [linea, lineaArticulo]
    );

    const crear_ = useCallback(async () => {
        const lineaConId = await postLinea(facturaId, lineaArticulo.modelo);
        publicar("linea_creada", lineaConId);
    }, [facturaId, lineaArticulo, publicar]);

    const cancelar_ = useCallback(
        () => publicar("crear_linea_cancelado"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crear_linea_factura"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLinea">
                <quimera-formulario>
                    <ArticuloLinea
                        tipo={linea.tipoArticulo}
                        idArticulo={linea.idArticulo}
                        articulo={linea.descripcionArticulo}
                        descripcion={linea.descripcion ?? ""}
                        nombre="idArticulo_nueva_linea_factura"
                        onChange={onArticuloCambiado}
                    />
                    <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
                    {linea.tipoArticulo === "libre" && (
                        <QInput
                            label="PVP unitario"
                            {...lineaArticulo.uiProps("pvpUnitario")}
                        />
                    )}
                </quimera-formulario>
                <div className="botones maestro-botones ">
                    <QBoton onClick={crear} deshabilitado={!lineaArticulo.valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
