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
import { metaNuevaLinea, nuevaLineaVacia } from "./dominio.ts";

export const CrearLinea = ({
  presupuestoId,
  publicar,
}: {
  presupuestoId: string;
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido } = useModelo(
    metaNuevaLinea,
    nuevaLineaVacia
  );
  const [creando, setCreando] = useState(false);

  const crear = useCallback(async () => {
    const idLinea = await intentar(() => postLinea(presupuestoId, modelo));
    setCreando(true);
    publicar("linea_creada", idLinea);
  }, [modelo, publicar, presupuestoId, intentar]);

  const cancelar = useCallback(() => {
    if (!creando) publicar("alta_linea_cancelada");
  }, [creando, publicar]);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="CrearLinea">
        <h2>Crear línea</h2>
        <quimera-formulario>
          <Articulo
            {...uiProps("referencia", "descripcion")}
            nombre="referencia_nueva_linea_presupuesto"
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
