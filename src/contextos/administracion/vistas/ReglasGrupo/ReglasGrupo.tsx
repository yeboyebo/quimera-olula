import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Permiso, Regla } from "../../diseño.ts";
import {
  actualizarPermiso,
  obtenerReglasAgrupadas,
  obtenerSubreglas,
} from "../../dominio.ts";
import { AccionesRegla } from "./AccionesRegla.tsx";
import "./ReglasGrupo.css";
import { SubReglas } from "./SubReglas.tsx";

type Estado = "lista" | "actualizando";

export const ReglasGrupo = ({
  reglas,
  grupoId,
  permisos,
}: {
  reglas: ReturnType<typeof useLista<Regla>>;
  grupoId: string;
  permisos: ReturnType<typeof useLista<Permiso>>;
}) => {
  const metaTablaReglas = (emitir: EmitirEvento) => [
    { id: "id", cabecera: "Regla" },
    { id: "descripcion", cabecera: "Descripción" },
    {
      id: "acciones",
      cabecera: "Acciones",
      render: (regla: Regla) => (
        <AccionesRegla
          regla={regla}
          grupoId={grupoId}
          emitir={emitir}
          permisos={permisos.lista}
        />
      ),
    },
  ];

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
        actualizarPermiso(permisos, regla.id, grupoId, true);
        console.log(`Permitir regla ${regla.id} del grupo ${grupoId}`);
        return "lista";
      },
      CANCELAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        actualizarPermiso(permisos, regla.id, grupoId, false);
        console.log(`Cancelar regla ${regla.id} del grupo ${grupoId}`);
        return "lista";
      },
      BORRAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        actualizarPermiso(permisos, regla.id, grupoId, null);
        console.log(`Borrar regla ${regla.id} del grupo ${grupoId}`);
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
    <div
      className="ReglasGrupo"
      style={{
        flexBasis: "50%",
        overflow: "hidden",
        maxWidth: "50%",
      }}
    >
      <h2>Reglas</h2>
      <QTabla
        metaTabla={metaTablaReglas(emitir)}
        datos={reglasAgrupadas}
        cargando={false}
        seleccionadaId={reglas.seleccionada?.id}
        onSeleccion={(regla) => emitir("ALTERNAR_SELECCION", regla)}
        orden={{ id: "ASC" }}
        onOrdenar={() => null}
        detalleExtra={(regla) => {
          const subreglas = obtenerSubreglas(reglas.lista, regla.id);
          return subreglas.length > 0 &&
            reglas.seleccionada?.id === regla.id ? (
            <SubReglas
              reglas={subreglas}
              permisos={permisos.lista}
              emitir={emitir}
              grupoId={grupoId}
            />
          ) : null;
        }}
      />
    </div>
  );
};
