import { TagArticulo } from "#/ventas/articulo/diseño.ts";
import { LineaPedido } from "#/ventas/pedido/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal, QSelect, QTextArea } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo, useState } from "react";
import { Calibre } from "../../comun/componentes/Calibre.tsx";
import { Marca } from "../../comun/componentes/Marca.tsx";
import { TipoPalet } from "../../comun/componentes/TipoPalet.tsx";
import { Variedad } from "../../comun/componentes/Variedad.tsx";
import "./EditarLinea.css";
import {
  FormEditarLineaDefecto,
  metaEditarLinea,
  patchLineaNrj,
} from "./editar_linea.ts";

export const EditarLineaNrj = ({
  pedidoId,
  publicar,
  linea,
}: {
  pedidoId: string;
  linea: LineaPedido;
  publicar: ProcesarEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const formEditarLineaInicial = useMemo(
    () => ({
      ...FormEditarLineaDefecto,
      ...linea,
    }),
    [linea]
  );

  const { modelo, uiProps, valido, set } = useModelo(
    metaEditarLinea,
    formEditarLineaInicial
  );

  const [cambiando, setCambiando] = useState(false);

  const cambiar = useCallback(async () => {
    await intentar(() => patchLineaNrj(pedidoId, linea.id, modelo));
    setCambiando(true);
    publicar("linea_actualizada");
  }, [modelo, publicar, pedidoId, intentar]);

  const cancelar = useCallback(() => {
    if (!cambiando) publicar("editar_linea_cancelado");
  }, [cambiando, publicar]);

  const handleArticuloChange = useCallback(
    (
      opcion: { valor: string; descripcion: string; datos?: TagArticulo } | null
    ) => {
      if (!opcion) return;

      const articulo = opcion.datos;
      if (!articulo) return;

      set({
        ...modelo,
      });
    },
    [modelo, set]
  );

  const focus = useFocus();
  const cantidadEnvasesNominal = modelo.cantidadPalets * modelo.envasesPorPalet;

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="EditarLinea">
        <h2>Editar línea NRJ</h2>

        <quimera-formulario>
          <TipoPalet
            label="Tipo Palet"
            {...uiProps("idTipoPalet", "tipo_palet_id")}
            ref={focus}
          />
          <Variedad label="Variedad" {...uiProps("idVariedad", "variedad")} />
          <Calibre label="Calibre" {...uiProps("idCalibre", "calibre")} />
          <Marca label="Marca" {...uiProps("idMarca", "marca")} />
          {/* <Categoria label="Categoria" {...uiProps("categoria")} /> */}
          <QSelect
            {...uiProps("categoria")}
            label="Categoria"
            opciones={[
              {
                valor: "1",
                descripcion: "1ª",
              },
              {
                valor: "2",
                descripcion: "2ª",
              },
              {
                valor: "3",
                descripcion: "3ª",
              },
            ]}
          />
          <QInput
            label="Cantidad Palets"
            {...uiProps("cantidadPalets")}
            nombre="cantidadPalets"
          />
          <div id="espacio4">
            {`Envases por palet: ${modelo.envasesPorPalet}`}
          </div>
          <div id="espacio4">
            {`Cantidad Envases Nominal: ${cantidadEnvasesNominal}`}
          </div>
          <div id="espacio4" />
          <div id="espacio4" />
          <QInput
            label="Cantidad Envases"
            {...uiProps("cantidadEnvases")}
            nombre="cantidadEnvases"
          />
          <QTextArea label="Observaciones" {...uiProps("observaciones")} />
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton texto="Guardar" onClick={cambiar} deshabilitado={!valido} />
        </div>
      </div>
    </QModal>
  );
};
