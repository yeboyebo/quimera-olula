import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useModelo } from "@olula/lib/useModelo.ts";
import {
  metaNuevaLineaAlbaran,
  nuevaLineaAlbaranVacia,
} from "../../../dominio.ts";

import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useContext } from "react";
import { postLinea } from "../../../infraestructura.ts";
import "./AltaLinea.css";

export const AltaLinea = ({
  activo = false,
  publicar,
  idAlbaran,
  refrescarCabecera,
}: {
  activo: boolean;
  publicar: EmitirEvento;
  idAlbaran: string;
  refrescarCabecera: () => void;
}) => {
  const { modelo, uiProps, valido, init } = useModelo(metaNuevaLineaAlbaran, {
    ...nuevaLineaAlbaranVacia,
    albaran_id: idAlbaran,
  });
  const { intentar } = useContext(ContextoError);

  const crear = async () => {
    await intentar(() => postLinea(idAlbaran, modelo));
    publicar("linea_creada");
    init();
    refrescarCabecera();
  };

  const cancelar = () => {
    publicar("creacion_cancelada");
    init();
  };

  return (
    <QModal abierto={activo} nombre="mostrar" onCerrar={cancelar}>
      <div className="AltaLinea">
        <h2>Nueva línea</h2>
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_pedido"
          />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
        </quimera-formulario>
        <div className="botones maestro-botones ">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
