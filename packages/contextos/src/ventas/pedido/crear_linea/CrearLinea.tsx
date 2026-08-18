import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import {
  metaNuevaLinea,
  metaNuevaLineaLibre,
  nuevaLineaLibreVacia,
  nuevaLineaVacia,
} from "./dominio.ts";

export type CrearLineaProps = {
  pedidoId: string;
  publicar: ProcesarEvento;
};

export const CrearLinea = (props: CrearLineaProps) => {
  const { app } = useContext(FactoryCtx);
  const CrearLinea_ = app.Ventas.pedido_CrearLinea as typeof CrearLineaBase;

  return CrearLinea_(props);
};

export const CrearLineaBase = ({ pedidoId, publicar }: CrearLineaProps) => {
  const [modoLibre, setModoLibre] = useState(false);

  const lineaArticulo = useModelo(metaNuevaLinea, nuevaLineaVacia);
  const lineaLibre = useModelo(metaNuevaLineaLibre, nuevaLineaLibreVacia);

  const focus = useFocus();

  const alternarModo = () => {
    setModoLibre(!modoLibre);
    lineaArticulo.init(nuevaLineaVacia);
    lineaLibre.init(nuevaLineaLibreVacia);
  };

  const crear_ = useCallback(async () => {
    const modelo = modoLibre ? lineaLibre.modelo : lineaArticulo.modelo;
    await postLinea(pedidoId, modelo);
    publicar("alta_linea_lista");
  }, [modoLibre, lineaLibre, lineaArticulo, publicar, pedidoId]);

  const cancelar_ = useCallback(
    () => publicar("crear_linea_cancelado"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);

  const valido = modoLibre ? lineaLibre.valido : lineaArticulo.valido;

  return (
    <QModal
      abierto={true}
      nombre="crear_linea_pedido"
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
                nombre="referencia_nueva_linea_pedido"
                ref={focus}
              />
              <QInput label="Cantidad" {...lineaArticulo.uiProps("cantidad")} />
            </>
          )}
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
