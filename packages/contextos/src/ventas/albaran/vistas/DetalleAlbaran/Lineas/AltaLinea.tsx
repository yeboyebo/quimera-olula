import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useState } from "react";
import {
  metaNuevaLineaAlbaran,
  nuevaLineaAlbaranVacia,
} from "../../../dominio.ts";
import "./AltaLinea.css";

export const AltaLinea = ({
  publicar,
}: {
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaAlbaran,
    nuevaLineaAlbaranVacia
  );
  const [creando, setCreando] = useState(false);

  const crear = async () => {
    setCreando(true);
    publicar("alta_de_linea_lista", modelo);
  };

  const cancelar = useCallback(() => {
    if (!creando) publicar("alta_de_linea_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="AltaLinea">
        <h2>Crear línea</h2>
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_albaran"
          />
          <QInput label="Cantidad" {...uiProps("cantidad")} />
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
