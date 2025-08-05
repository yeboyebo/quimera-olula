import { QLista } from "../../../../componentes/atomos/qlista.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Grupo, Permiso, Regla } from "../../diseño.ts";
import { actualizarPermiso, obtenerReglasAgrupadas } from "../../dominio.ts";
import { putPermiso } from "../../infraestructura.ts";
import { AccionesRegla } from "./AccionesRegla.tsx";
import "./ReglasGrupo.css";

type Estado = "lista" | "actualizando";

export const ReglasGrupo = ({
  reglas,
  grupoSeleccionado,
  permisos,
}: {
  reglas: ReturnType<typeof useLista<Regla>>;
  grupoSeleccionado: Grupo | null;
  permisos: ReturnType<typeof useLista<Permiso>>;
}) => {
  // useEffect(() => {
  //   // getPermisos().then(permisos.setLista);
  // }, []);

  const maquina: Maquina<Estado> = {
    lista: {
      ALTERNAR_SELECCION: (payload: unknown) => {
        const regla = payload as Regla;
        if (reglas.seleccionada?.id === regla.id) {
          reglas.limpiarSeleccion();
          return "lista";
        }
        reglas.seleccionar(regla);
      },
      PERMITIR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        if (grupoSeleccionado?.id) {
          putPermiso(grupoSeleccionado.id, regla.id, true);
          actualizarPermiso(
            permisos,
            regla.id,
            grupoSeleccionado?.id ?? "",
            true
          );
          // console.log(
          //   `Permitir regla ${regla.id} del grupo ${grupoSeleccionado?.id}`
          // );
        }
        return "lista";
      },
      CANCELAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        if (grupoSeleccionado?.id) {
          putPermiso(grupoSeleccionado.id, regla.id, false);
          actualizarPermiso(
            permisos,
            regla.id,
            grupoSeleccionado?.id ?? "",
            false
          );
        }
        console.log(
          `Cancelar regla ${regla.id} del grupo ${grupoSeleccionado?.id}`
        );
        return "lista";
      },
      BORRAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        // actualizarPermiso(
        //   permisos,
        //   regla.id,
        //   grupoSeleccionado?.id ?? "",
        //   null
        // );
        console.log(
          `Borrar regla ${regla.id} del grupo ${grupoSeleccionado?.id}`
        );
        return "lista";
      },
    },
    actualizando: {
      FINALIZAR_ACTUALIZACION: "lista",
    },
  };

  const emitir = useMaquina(maquina, "lista", () => {});

  const reglasAgrupadas = obtenerReglasAgrupadas(reglas.lista);

  return (
    <div className="ReglasGrupo">
      <h2>Reglas</h2>
      <QLista<Regla>
        datos={reglasAgrupadas}
        cargando={false}
        render={(regla: Regla) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{regla.descripcion}</div>
            <AccionesRegla
              regla={regla}
              grupoId={grupoSeleccionado?.id || ""}
              emitir={emitir}
              permisos={permisos.lista}
            />
          </div>
        )}
      />
    </div>
  );
};
