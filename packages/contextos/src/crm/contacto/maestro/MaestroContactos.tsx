import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect, useState } from "react";
import { CrearContacto } from "../crear/CrearContacto.tsx";
import { DetalleContacto } from "../detalle/DetalleContacto.tsx";
import { Contacto } from "../diseño.ts";
import { metaTablaContacto } from "./maestro.ts";
import "./MaestroContactos.css";
import { getMaquina } from "./maquina.ts";

export const MaestroContactos = () => {
  const [cargando, setCargando] = useState(false);

  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    contactos: listaEntidadesInicial<Contacto>(),
  });

  const crear = useCallback(
    () => emitir("creacion_de_contacto_solicitada"),
    [emitir]
  );

  const setSeleccionado = useCallback(
    (payload: Contacto) => emitir("contacto_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      setCargando(true);
      await emitir("recarga_de_contactos_solicitada", criteria);
      setCargando(false);
    },
    [emitir, setCargando]
  );

  useEffect(() => {
    recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Contacto">
      <MaestroDetalleControlado<Contacto>
        Maestro={
          <>
            <h2>Contactos</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo</QBoton>
            </div>
            <ListadoControlado<Contacto>
              metaTabla={metaTablaContacto}
              metaFiltro={true}
              cargando={cargando}
              criteriaInicial={criteriaDefecto}
              modo={"tabla"}
              // setModo={handleSetModoVisualizacion}
              // tarjeta={tarjeta}
              entidades={ctx.contactos.lista}
              totalEntidades={ctx.contactos.total}
              seleccionada={ctx.contactos.activo}
              onSeleccion={setSeleccionado}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleContacto inicial={ctx.contactos.activo} publicar={emitir} />
        }
        seleccionada={ctx.contactos.activo}
        modoDisposicion="maestro-50"
      />

      {ctx.estado === "CREANDO" && <CrearContacto publicar={emitir} />}
    </div>
  );
};
