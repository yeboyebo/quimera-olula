import { LineaADevolver, VentaTpv } from "#/ventas/ventaTpv/diseño.ts";
import { getVentaADevolver, patchDevolverVenta } from "#/ventas/ventaTpv/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal, QTabla } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useContext, useEffect, useState } from "react";
import { CantidadADevolver } from "./CantidadADevolver.tsx";
import "./DevolucionVenta.css";



export const DevolucionVenta = (
    {
        publicar,
        activo,
        idVenta,
    }: {
        publicar: EmitirEvento;
        activo: boolean;
        idVenta: string;
    }
) => {

    const { intentar } = useContext(ContextoError);

    const [venta, setVenta] = useState<VentaTpv | null>(null);
    const [lineas, setLineas] = useState<LineaADevolver[]>([]);

    const buscarVenta = async (codVenta: string) => {
        
        const venta = await intentar(() => getVentaADevolver(codVenta));
        setLineas(venta.lineas.map((linea) => {
            return {
                ...linea,
                aDevolver: 0,
            };
        }));
        setVenta(venta);
    };

    const devolver = async () => {
        if (!venta) {
            return;
        }
        await intentar(() => patchDevolverVenta(idVenta, venta, lineas));
        publicar("venta_devuelta", venta);
    };

    const cancelar = () => {
        publicar("devolucion_cancelada");
    };

    const cambiarCantidadADevolver = (linea: LineaADevolver, aDevolver: number) => {

        setLineas(lineas.map((l) => {
            if (l.id === linea.id) {
                return {
                    ...l,
                    aDevolver,
                };
            }
            return l;
        }));
    };

    const puedoDevolver = () => {
        return lineas.some((l) => l.aDevolver > 0);
    };

    useEffect(() => {
        if (activo) {
          setVenta(null);
          setLineas([]);
        }
    }, [activo]);

    return (
        <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
        <div className="DevolucionVenta">
            <h2>{`Devolver venta ${venta?.codigo || ""}`} </h2>
            <quimera-formulario>
                <QInput label='Venta' nombre='venta' onEnterKeyUp={
                    (barcode)=>buscarVenta(barcode)
                    }>
                </QInput>
            </quimera-formulario>

            <QTabla
                metaTabla={getMetaTablaLineas(cambiarCantidadADevolver)}
                datos={lineas}
                cargando={false}
                seleccionadaId={undefined}
                onSeleccion={() => null}
                orden={["id", "ASC"]}
                onOrdenar={(_: string) => null}
            />

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