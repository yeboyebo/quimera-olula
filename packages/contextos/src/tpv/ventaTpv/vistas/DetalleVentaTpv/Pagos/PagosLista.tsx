import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { PagoVentaTpv } from "../../../diseño.ts";

export const PagosLista = ({
  pagos,
  publicar,
}: {
  pagos: ListaSeleccionable<PagoVentaTpv>;
  publicar: EmitirEvento;
}) => {
  

  const setSeleccionado = (pago: PagoVentaTpv) => {
    publicar("pago_seleccionado", pago);
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaPagos()}
        datos={pagos.lista}
        cargando={false}
        seleccionadaId={pagos.idActivo || undefined}
        onSeleccion={setSeleccionado}
        orden={["id", "ASC"]}
        onOrdenar={(_: string) => null}
      />
    </>
  );
};

export const ItemPagoVentaTpv = ({
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
