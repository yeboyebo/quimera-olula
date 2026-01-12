import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { Criteria, RespuestaLista2 } from "@olula/lib/diseño.js";
import { criteriaDefecto, formatearFechaDate } from "@olula/lib/dominio.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { PagoArqueoTpv } from "../../diseño.ts";
import { getPagosArqueo } from "../../infraestructura.ts";



export const ListaPagos = ({
    arqueoId,
}: {
    arqueoId?: string;
}) => {
    
    const { intentar } = useContext(ContextoError);

    const [arqueoIdAnterior, setArqueoIdAnterior] = useState<string | null>(null);
    const [pagos, setPagos] = useState<RespuestaLista2<PagoArqueoTpv>>({ datos:[], total: 0 });

    const cargarPagos = useCallback(async (criteria: Criteria = criteriaDefecto) => {
        if (arqueoId) {
            const respuesta = await intentar(() => getPagosArqueo(arqueoId, criteria));
            setPagos({
                datos: respuesta.datos,
                total: respuesta.total < 0 ? pagos.total : respuesta.total 
            });
        }
    }, [arqueoId, intentar, pagos, setPagos]);
    
    useEffect(() => {
        if (arqueoId && arqueoId !== arqueoIdAnterior) {
            setArqueoIdAnterior(arqueoId);
            cargarPagos();
        }
    }, [arqueoId, cargarPagos, arqueoIdAnterior, setArqueoIdAnterior]);

    return (
        <ListadoControlado
            metaTabla={getMetaTablaPagos()}
            metaFiltro={true}
            cargando={false}
            criteriaInicial={criteriaDefecto}
            idReiniciarCriteria={arqueoId}
            modo={'tabla'}
            entidades={pagos.datos}
            totalEntidades={pagos.total}
            seleccionada={null}
            onSeleccion={()=>{}}
            onCriteriaChanged={cargarPagos}
        />
    );
};

const ItemPagoArqueoTpv = ({
    pago,
}: {
    pago: PagoArqueoTpv;
}) => {

    return (
        <>
            {`${pago.codigoVenta} -${pago.formaPago} - ${formatearFechaDate(pago.fecha)} - ${pago.importe}€`}
        </>
    );
};

const getMetaTablaPagos = () => {
    return [
        {
            id: "pago",
            cabecera: "Pagos",
            render: (pago: PagoArqueoTpv) => (
                <ItemPagoArqueoTpv
                    pago={pago}
                />
            ),
        },
    ];
};
