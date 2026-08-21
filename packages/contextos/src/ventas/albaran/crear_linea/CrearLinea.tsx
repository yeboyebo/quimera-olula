import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import { altaLineaDesdeNuevaLinea, altaLineaDesdeNuevaLineaLibre } from "../../venta/dominio.ts";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import {
  metaNuevaLineaAlbaran,
  metaNuevaLineaLibreAlbaran,
  nuevaLineaAlbaranVacia,
  nuevaLineaLibreAlbaranVacia,
} from "./dominio.ts";

export const CrearLinea = ({
  albaranId,
  publicar,
}: {
  albaranId: string;
  publicar: ProcesarEvento;
}) => {
  const [modoLibre, setModoLibre] = useState(false);

  const lineaArticulo = useModelo(metaNuevaLineaAlbaran, nuevaLineaAlbaranVacia);
  const lineaLibre = useModelo(
    metaNuevaLineaLibreAlbaran,
    nuevaLineaLibreAlbaranVacia
  );

  const focus = useFocus();

  const alternarModo = () => {
    setModoLibre(!modoLibre);
    lineaArticulo.init(nuevaLineaAlbaranVacia);
    lineaLibre.init(nuevaLineaLibreAlbaranVacia);
  };

  const crear_ = useCallback(async () => {
    const altaLinea = modoLibre
      ? altaLineaDesdeNuevaLineaLibre(lineaLibre.modelo)
      : altaLineaDesdeNuevaLinea(lineaArticulo.modelo);
    await postLinea(albaranId, altaLinea);
    publicar("alta_linea_lista");
  }, [modoLibre, lineaLibre, lineaArticulo, albaranId, publicar]);

  const cancelar_ = useCallback(
    () => publicar("crear_linea_cancelado"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  const valido = modoLibre ? lineaLibre.valido : lineaArticulo.valido;

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_albaran"
      titulo="Crear línea"
      onCerrar={cancelar}
    >
      <div className="modo-linea">
        <QBoton onClick={alternarModo} variante="texto" tipo="button">
          {modoLibre ? "Artículo del catálogo" : "Línea sin artículo"}
        </QBoton>
      </div>
      <div className="CrearLinea">
        <quimera-formulario>
          {modoLibre ? (
            <>
              <QInput
                label="Descripción"
                {...lineaLibre.uiProps("descripcion")}
                ref={focus}
              />
              <QInput label="Cantidad" {...lineaLibre.uiProps("cantidad")} />
              <QInput
                label="PVP unitario"
                {...lineaLibre.uiProps("pvp_unitario")}
              />
            </>
          ) : (
            <>
              <Articulo
                {...lineaArticulo.uiProps("referencia", "descripcion")}
                nombre="referencia_nueva_linea_albaran"
                ref={focus}
              />
              <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
            </>
          )}
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
