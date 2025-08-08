import { useContext, useEffect, useState } from "react";
import { ContextoError } from "../../../comun/contexto.ts";
import { useLista } from "../../../comun/useLista.ts";
import { Maquina, useMaquina } from "../../../comun/useMaquina.ts";
import { CategoriaReglas, Grupo, Regla, ReglaAnidada } from "../../diseño.ts";
import { getReglasPorGrupoPermiso } from "../../dominio.ts";
import { getPermisosGrupo, putPermiso } from "../../infraestructura.ts";
import "./ReglasGrupo.css";
import { ReglasOrganizadas } from "./ReglasOrganizadas";

type Estado = "lista" | "actualizando";

export const ReglasGrupo = ({
  reglas,
  grupoSeleccionado,
}: {
  reglas: ReturnType<typeof useLista<Regla>>;
  grupoSeleccionado: Grupo | null;
}) => {
  const { intentar } = useContext(ContextoError);
  const [reglasOrganizadas, setReglasOrganizadas] = useState<CategoriaReglas[]>(
    []
  );
  const [categoriasAbiertas, setCategoriasAbiertas] = useState<
    Record<string, boolean>
  >({});

  const actualizarReglaOrganizada = (
    reglaId: string,
    nuevoValor: boolean | null
  ) => {
    const actualizarRegla = (regla: ReglaAnidada): ReglaAnidada => {
      const valorActualizado = regla.id === reglaId ? nuevoValor : regla.valor;
      const hijosActualizados = regla.hijos?.map(actualizarRegla);
      return {
        ...regla,
        valor: valorActualizado,
        ...(hijosActualizados && { hijos: hijosActualizados }),
      };
    };

    setReglasOrganizadas((prev) =>
      prev.map((categoria) => ({
        ...categoria,
        reglas: categoria.reglas.map(actualizarRegla),
      }))
    );
  };

  useEffect(() => {
    if (grupoSeleccionado?.id) {
      getPermisosGrupo(grupoSeleccionado.id).then(({ datos: permisos }) => {
        const organizadas = getReglasPorGrupoPermiso(
          grupoSeleccionado.id,
          reglas.lista,
          permisos
        );
        setReglasOrganizadas(organizadas);
      });
    }
  }, [grupoSeleccionado?.id, reglas.lista]);

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
          intentar(() => putPermiso(grupoSeleccionado.id, regla.id, true));
          actualizarReglaOrganizada(regla.id, true);
        }
        return "lista";
      },
      CANCELAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        if (grupoSeleccionado?.id) {
          intentar(() => putPermiso(grupoSeleccionado.id, regla.id, false));
          actualizarReglaOrganizada(regla.id, false);
        }
        return "lista";
      },
      BORRAR_REGLA: (payload: unknown) => {
        const regla = payload as Regla;
        if (grupoSeleccionado?.id) {
          intentar(() => putPermiso(grupoSeleccionado.id, regla.id, null));
          actualizarReglaOrganizada(regla.id, null);
        }
        return "lista";
      },
      TOGGLE_CATEGORIA: (payload: unknown) => {
        const categoriaId = payload as string;
        setCategoriasAbiertas((prev) => ({
          ...prev,
          [categoriaId]: !prev[categoriaId],
        }));
        return "lista";
      },
    },
    actualizando: {
      FINALIZAR_ACTUALIZACION: "lista",
    },
  };

  const emitir = useMaquina(maquina, "lista", () => {});

  return (
    <div className="ReglasGrupo">
      <h2>
        Reglas{" "}
        {grupoSeleccionado && grupoSeleccionado?.descripcion
          ? ` ${grupoSeleccionado.descripcion}`
          : ""}
      </h2>
      <div className="ListaReglas">
        <ReglasOrganizadas
          reglasOrganizadas={reglasOrganizadas}
          grupoSeleccionado={grupoSeleccionado}
          categoriasAbiertas={categoriasAbiertas}
          emitir={emitir}
        />
      </div>
    </div>
  );
};
