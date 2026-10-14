import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { LineaFactura } from "../../factura/diseño.ts";
import { getLineas } from "../../factura/infraestructura.ts";
import { articuloDeLineaVenta } from "./linea_venta_texto.ts";

/** Línea que sí lleva artículo: las de texto libre no son seleccionables. */
type LineaConArticulo = LineaFactura & { referencia: string };

export type OpcionArticuloFactura = {
  /** Id de la línea: cada línea de la factura es una opción, aunque repita artículo. */
  valor: string;
  /** Descripción del artículo: es lo que se guarda y lo que queda en el campo. */
  descripcion: string;
  /** Texto largo del desplegable: lo genera renderOpcion. */
  descripcionOpcion: string;
  /** Referencia del artículo, para quien guarde el artículo en vez de la línea. */
  referencia: string;
  cantidad: number;
  pvpUnitario: number;
  /** Total de la línea, con los descuentos ya aplicados. */
  pvpTotal: number;
  linea: LineaFactura;
};

interface ArticuloFacturaProps {
  /** Factura de cuyas líneas se sacan los artículos. Vacía = todavía no hay factura elegida. */
  facturaId: string;
  /** Divisa con la que se formatean importes; la línea no la lleva. */
  divisa?: string;
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  deshabilitado?: boolean;
  autoFocus?: boolean;
  longitudMinima?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
  renderOpcion?: (linea: LineaFactura) => string;
  onChange?: (opcion: OpcionArticuloFactura | null) => void;
}

const coincide = (linea: LineaConArticulo, texto: string) => {
  const busqueda = texto.trim().toLowerCase();
  if (!busqueda) return true;

  return `${linea.referencia} ${linea.descripcion ?? ""}`
    .toLowerCase()
    .includes(busqueda);
};

export const ArticuloFactura = ({
  facturaId,
  divisa = "EUR",
  descripcion = "",
  valor,
  nombre = "linea_factura_id",
  label = "Artículo de la factura",
  deshabilitado = false,
  longitudMinima = 0,
  renderOpcion,
  onChange,
  ...props
}: ArticuloFacturaProps) => {
  const [intentoBusquedaSinFactura, setIntentoBusquedaSinFactura] =
    useState(false);
  const [descripcionResuelta, setDescripcionResuelta] = useState(descripcion);

  // Las líneas se leen enteras una vez y se filtran en memoria: el endpoint de líneas
  // no admite filtro, así que buscar en servidor repetiría la misma petición en cada tecla.
  const cache = useRef<{ facturaId: string; lineas: LineaFactura[] } | null>(
    null
  );

  const lineasDeFactura = useCallback(async (): Promise<LineaFactura[]> => {
    if (cache.current?.facturaId === facturaId) return cache.current.lineas;

    const lineas = await getLineas(facturaId);
    cache.current = { facturaId, lineas };
    return lineas;
  }, [facturaId]);

  // Con un valor ya guardado y sin descripción, se resuelve contra las líneas de la factura.
  // El valor puede ser el id de la línea o la referencia del artículo, según lo que guarde
  // el consumidor (la ficha de incidencia, por ejemplo, guarda la referencia).
  useEffect(() => {
    if (!valor || descripcion) {
      setDescripcionResuelta(descripcion);
      return;
    }
    if (!facturaId || facturaId.trim() === "") {
      setDescripcionResuelta("");
      return;
    }

    let cancelado = false;
    lineasDeFactura().then((lineas) => {
      const linea = lineas.find(
        (l) => l.id === valor || l.referencia === valor
      );
      if (!cancelado) setDescripcionResuelta(linea?.descripcion ?? "");
    });

    return () => {
      cancelado = true;
    };
  }, [valor, descripcion, facturaId, lineasDeFactura]);

  const describir =
    renderOpcion ?? ((linea: LineaFactura) => articuloDeLineaVenta(linea, divisa));

  const obtenerOpciones = async (
    texto: string,
    id?: string
  ): Promise<OpcionArticuloFactura[]> => {
    if (!facturaId || facturaId.trim() === "") {
      setIntentoBusquedaSinFactura(true);
      return [];
    }

    setIntentoBusquedaSinFactura(false);

    const lineas = await lineasDeFactura();
    const conArticulo = lineas.filter(
      (linea): linea is LineaConArticulo => !!linea.referencia
    );

    const seleccionadas = id
      ? conArticulo.filter((linea) => linea.id === id || linea.referencia === id)
      : conArticulo.filter((linea) => coincide(linea, texto));

    // Orden por referencia ASC; el de las líneas de la factura desempata, porque
    // Array.sort es estable y un mismo artículo puede estar en varias líneas.
    seleccionadas.sort((una, otra) => una.referencia.localeCompare(otra.referencia));

    return seleccionadas.map((linea) => ({
      valor: linea.id,
      descripcion: linea.descripcion,
      descripcionOpcion: describir(linea),
      referencia: linea.referencia,
      cantidad: linea.cantidad,
      pvpUnitario: linea.pvp_unitario,
      pvpTotal: linea.pvp_total,
      linea,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcionResuelta}
      deshabilitado={deshabilitado}
      longitudMinima={longitudMinima}
      erroneo={intentoBusquedaSinFactura}
      textoValidacion={
        intentoBusquedaSinFactura
          ? "El campo factura debe estar informado"
          : undefined
      }
      {...props}
    />
  );
};
