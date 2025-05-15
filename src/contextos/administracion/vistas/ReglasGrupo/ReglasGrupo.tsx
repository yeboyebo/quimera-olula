import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { Regla } from "../../diseño.ts";

const metaTablaReglas = (emitirActualizarPermisos: (regla: Regla) => void) => [
  { id: "id", cabecera: "Regla" },
  { id: "descripcion", cabecera: "Descripción" },
  {
    id: "acciones",
    cabecera: "Acciones",
    render: (regla: Regla) => (
      <button onClick={() => emitirActualizarPermisos(regla)}>
        Actualizar Permisos
      </button>
    ),
  },
];

type Estado = "lista" | "actualizando";

export const ReglasGrupo = ({
  reglas,
  grupoId,
}: {
  reglas: ReturnType<typeof useLista<Regla>>;
  grupoId: string;
}) => {
  const maquina: Maquina<Estado> = {
    lista: {
      REGLA_SELECCIONADA: (payload: unknown) => {
        const regla = payload as Regla;
        reglas.seleccionar(regla);
      },
      ACTUALIZAR_PERMISOS: async (payload: unknown) => {
        const regla = payload as Regla;
        console.log(
          `Actualizando permisos para la regla ${regla.id} del grupo ${grupoId}`
        );

        return "lista";
      },
    },
    actualizando: {
      FINALIZAR_ACTUALIZACION: "lista",
    },
  };

  const emitir = useMaquina(maquina, "lista", () => {});

  const emitirActualizarPermisos = (regla: Regla) => {
    emitir("ACTUALIZAR_PERMISOS", regla);
  };

  const reglasAgrupadas = reglas.lista.filter(
    (regla) => !regla.id.includes("/")
  );

  return (
    <div style={{ flexBasis: "50%", overflow: "auto" }}>
      <h2>Reglas</h2>
      <QTabla
        metaTabla={metaTablaReglas(emitirActualizarPermisos)}
        datos={reglasAgrupadas}
        cargando={false}
        seleccionadaId={reglas.seleccionada?.id}
        onSeleccion={(regla) => emitir("REGLA_SELECCIONADA", regla)}
        orden={{ id: "ASC" }}
        onOrdenar={() => null}
      />
    </div>
  );
};
