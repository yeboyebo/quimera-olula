import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { ListadoControlado } from "@olula/componentes/maestro/ListadoControlado.js";
import { MaestroDetalleControlado } from "@olula/componentes/maestro/MaestroDetalleControlado.tsx";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useCallback, useEffect } from "react";
import { CrearUsuario } from "../crear/CrearUsuario.tsx";
import { DetalleUsuario } from "../detalle/DetalleUsuario.tsx";
import { Usuario } from "../diseño.ts";
import { metaTablaUsuario } from "../dominio.ts";
import "./MaestroConDetalleUsuario.css";
import { getMaquina } from "./maquina.ts";

const criteriaBaseUsuarios = {
  ...criteriaDefecto,
  orden: ["id", "DESC"],
};

export const MaestroConDetalleUsuario = () => {
  const { ctx, emitir } = useMaquina(getMaquina, {
    estado: "INICIAL",
    usuarios: listaEntidadesInicial<Usuario>(),
  });

  const crear = useCallback(
    () => emitir("creacion_de_usuario_solicitada"),
    [emitir]
  );

  const setSeleccionada = useCallback(
    (payload: Usuario) => emitir("usuario_seleccionado", payload),
    [emitir]
  );

  const recargar = useCallback(
    async (criteria: Criteria) => {
      await emitir("recarga_de_usuarios_solicitada", criteria);
    },
    [emitir]
  );

  useEffect(() => {
    emitir("recarga_de_usuarios_solicitada", criteriaBaseUsuarios);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Usuario">
      <MaestroDetalleControlado<Usuario>
        Maestro={
          <>
            <h2>Usuarios</h2>
            <div className="maestro-botones">
              <QBoton onClick={crear}>Nuevo Usuario</QBoton>
            </div>
            <ListadoControlado
              metaTabla={metaTablaUsuario}
              criteriaInicial={criteriaBaseUsuarios}
              modo="tabla"
              entidades={ctx.usuarios.lista}
              totalEntidades={ctx.usuarios.total}
              seleccionada={ctx.usuarios.activo}
              onSeleccion={setSeleccionada}
              onCriteriaChanged={recargar}
            />
          </>
        }
        Detalle={
          <DetalleUsuario
            usuarioInicial={ctx.usuarios.activo}
            publicar={emitir}
          />
        }
        seleccionada={ctx.usuarios.activo}
      />

      <CrearUsuario
        publicar={emitir}
        activo={ctx.estado === "CREANDO_USUARIO"}
      />
    </div>
  );
};
