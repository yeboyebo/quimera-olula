import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
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
    <>
      <QTabla
        metaTabla={getMetaTablaPagos()}
        datos={pagos}
        cargando={false}
        seleccionadaId={pagoActivo?.id || undefined}
        onSeleccion={setSeleccionado}
        orden={["id", "ASC"]}
        onOrdenar={(_: string) => null}
      />
    </>
  );
};

const ItemPagoVentaTpv = ({
  pago,
}: {
  pago: PagoVentaTpv;
}) => {

  return (
    <>
      {`${pago.forma_pago}: ${pago.importe}€`}
    </>
  );
};

const getMetaTablaPagos = () => {
  return [
    {
      id: "pago",
      cabecera: "Pagos",
      render: (pago: PagoVentaTpv) => (
        <ItemPagoVentaTpv
          pago={pago}
        />
      ),
    },
  ];
};
