import { Articulo } from "#/ventas/comun/componentes/articulo.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { postLinea } from "../infraestructura.ts";
import "./CrearLinea.css";
import { metaNuevaLineaAlbaran, nuevaLineaAlbaranVacia } from "./dominio.ts";

export const CrearLinea = ({
  albaranId,
  publicar,
}: {
  albaranId: string;
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLineaAlbaran,
    nuevaLineaAlbaranVacia
  );
  const [creando, setCreando] = useState(false);

  const crear = useCallback(async () => {
    await intentar(() => postLinea(albaranId, modelo));
    setCreando(true);
    publicar("alta_linea_lista");
  }, [modelo, publicar, albaranId, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("crear_linea_cancelado");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearLinea">
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
