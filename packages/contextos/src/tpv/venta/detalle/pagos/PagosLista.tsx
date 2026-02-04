import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla, QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QIcono } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { PagoVentaTpv } from "../../diseño.ts";

export const PagosLista = ({
    pagos,
    pagoActivo,
    publicar,
}: {
    pagos: PagoVentaTpv[];
    pagoActivo: PagoVentaTpv | null;
    publicar: EmitirEvento;
}) => {
    const setSeleccionado = (pago: PagoVentaTpv) => {
        publicar("pago_seleccionado", pago);
    };

    return (

        <QTabla
            metaTabla={getMetaTablaPagos()}
            datos={pagos}
            cargando={false}
            seleccionadaId={pagoActivo?.id || undefined}
            onSeleccion={setSeleccionado}
            orden={["id", "ASC"]}
            onOrdenar={(_: string) => null}
        />

    );
};

const getMetaTablaPagos = () => {
    const meta:MetaTabla<PagoVentaTpv> = [
        {
            id: "bloqueado",
            cabecera: '',
            render: (pago: PagoVentaTpv) => <ColumnaEstadoTabla
                estados={{
                    abierto,
                    cerrado,
                }}
                estadoActual={pago.arqueoAbierto ? "abierto" : "cerrado"}
            />
        },
        {
            id: "fecha",
            cabecera: "Fecha",
            tipo: "fecha",
        },
        { id: "formaPago", cabecera: "Forma de pago",
            render: (pago: PagoVentaTpv) => pago.vale
                ? `${pago.formaPago} ${pago.vale}`
                : `${pago.formaPago}`,
        },
        { id: "importe", cabecera: "Importe", tipo: "moneda" },
        { id: "idArqueo", cabecera: "Arqueo" },
    ];

    return meta;
};

const abierto = (
    <QIcono
        nombre={"circulo_relleno"}
        tamaño="sm"
        color="var(--color-exito-oscuro)"
    />
)

const cerrado = (
    <QIcono
        nombre={"circulo_relleno"}
        tamaño="sm"
        color="var(--color-deshabilitado-oscuro)"
    />
)