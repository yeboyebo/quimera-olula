import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import {
  metaNuevaLinea,
  metaNuevaLineaLibre,
  nuevaLineaLibreVacia,
  nuevaLineaVacia,
} from "./dominio.ts";

export const CrearLinea = ({
  presupuestoId,
  publicar,
}: {
  presupuestoId: string;
  publicar: EmitirEvento;
}) => {
  const [modoLibre, setModoLibre] = useState(false);

  const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaVacia);
  const lineaLibre = useModelo(metaNuevaLineaLibre, nuevaLineaLibreVacia);

  const focus = useFocus();

  const reiniciar = useCallback(() => {
    lineaArticulo.init(nuevaLineaVacia);
    lineaLibre.init(nuevaLineaLibreVacia);
  }, [lineaArticulo, lineaLibre]);

  const alternarModo = () => {
    setModoLibre(!modoLibre);
    reiniciar();
  };

  const crear_ = useCallback(async () => {
    const modelo = modoLibre ? lineaLibre.modelo : lineaArticulo.modelo;
    const idLinea = await postLinea(presupuestoId, modelo);
    publicar("linea_creada", idLinea);
  }, [modoLibre, lineaLibre, lineaArticulo, presupuestoId, publicar]);

  const cancelar_ = useCallback(
    () => publicar("crear_linea_cancelado"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  const valido = modoLibre ? lineaLibre.valido : lineaArticulo.valido;

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_presupuesto"
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
                nombre="referencia_nueva_linea_presupuesto"
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
