import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.ts";
import { useContext } from "react";
import { PagoVentaTpv } from "../../../diseño.ts";

export const PagosLista = ({
  pagos,
  // seleccionado,
  publicar,
  idVenta,
  // refrescarCabecera,
}: {
  pagos: ListaSeleccionable<PagoVentaTpv>;
  // seleccionado?: string;
  publicar: EmitirEvento;
  idVenta: string;
  // refrescarCabecera: () => void;
}) => {
  
  const { intentar } = useContext(ContextoError);

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
