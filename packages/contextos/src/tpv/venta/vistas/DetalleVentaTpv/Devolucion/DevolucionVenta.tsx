import { LineaADevolver, VentaTpv, VentaTpvADevolver } from "#/tpv/venta/diseño.ts";
import { getVentaADevolver } from "#/tpv/venta/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal, QTabla } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback, useContext, useState } from "react";
import { CantidadADevolver } from "./CantidadADevolver.tsx";
import "./DevolucionVenta.css";

export const DevolucionVenta = (
    {
        publicar,
        venta,
    }: {
        publicar: EmitirEvento;
        venta: VentaTpv;
    }
) => {

    const { intentar } = useContext(ContextoError);

    const [ventaADevolver, setVentaADevolver] = useState<VentaTpvADevolver | null>(null);
    const [devolviendo, setDevolviendo] = useState(false);

    const buscarVenta = async (codVenta: string) => {
        const v = await intentar(() => getVentaADevolver(codVenta));
        setVentaADevolver(v);
    };

    const devolver = () => {
        setDevolviendo(true);
        publicar("devolucion_lista", ventaADevolver);
    };

    const cancelar = useCallback(
        () => {
            if (!devolviendo) publicar("devolucion_cancelada");
        },
        [devolviendo, publicar]
    );    

    const cambiarCantidadADevolver = (linea: LineaADevolver, aDevolver: number) => {

        if (ventaADevolver) {
            setVentaADevolver({
                ...ventaADevolver,
                lineas: ventaADevolver.lineas.map((l) => 
                    l.id === linea.id
                        ? { ...l, aDevolver}
                        : l
                )
            });
        }

    };

    const puedoDevolver = () => {
        return ventaADevolver && ventaADevolver.lineas.some((l) => l.aDevolver > 0);
    };

    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
        <div className="DevolucionVenta">
            <h2>{`Devolver venta ${venta?.codigo || ""}`} </h2>
            <quimera-formulario>
                <QInput label='Venta' nombre='venta' onEnterKeyUp={
                    (barcode)=>buscarVenta(barcode)
                    }>
                </QInput>
            </quimera-formulario>

            { ventaADevolver &&
                <QTabla
                    metaTabla={getMetaTablaLineas(cambiarCantidadADevolver)}
                    datos={ventaADevolver.lineas}
                    cargando={false}
                    seleccionadaId={undefined}
                    onSeleccion={() => null}
                    orden={["id", "ASC"]}
                    onOrdenar={(_: string) => null}
                />
            }

            <div className="botones maestro-botones ">
                <QBoton onClick={devolver} deshabilitado={!puedoDevolver}>
                    Devolver
                </QBoton>
            </div>
        </div>
        </QModal>
  );
};

const getMetaTablaLineas = (
  cambiarCantidadADevolver: (linea: LineaADevolver, cantidad: number) => void
) => {
    return [
        {
        id: "linea",
        cabecera: "Línea",
        render: (linea: LineaADevolver) => `${linea.referencia}: ${linea.descripcion}`,
        },
        {
        id: "cantidad",
        cabecera: "Cantidad",
        },   
        {
            id: "aDevolver",
            cabecera: "A Devolver",
            render: (linea: LineaADevolver) => (
                <CantidadADevolver
                    linea={linea}
                    onCantidadEditada={cambiarCantidadADevolver}
                />
            ),
        },
        { id: "pvp_unitario", cabecera: "Precio" },
        { id: "grupo_iva_producto_id", cabecera: "IVA" },
        {
        id: "dto_porcentual",
        cabecera: "% Dto.",
        render: (linea: LineaADevolver) =>
            linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
        },
        { id: "pvp_total", cabecera: "Total" },
    ];
};