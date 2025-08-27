import { useContext, useEffect } from "react";
import { QBoton } from "../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../componentes/atomos/qtabla.tsx";
import { ContextoError } from "../../../../comun/contexto.ts";
import { ListaSeleccionable } from "../../../../comun/diseño.ts";
import {
  cargarLista,
  incluirEnLista,
  listaSeleccionableVacia,
  quitarDeLista,
  seleccionarItemEnLista,
} from "../../../../comun/entidad.ts";
import { ConfigMaquina3, useMaquina3 } from "../../../../comun/useMaquina.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { OportunidadVenta } from "../../../oportunidadventa/diseño.ts";
import { metaTablaOportunidadVenta } from "../../../oportunidadventa/dominio.ts";
import { AltaOportunidadVenta } from "../../../oportunidadventa/vistas/AltaOportunidadVenta.tsx";
import { BajaOportunidadVenta } from "../../../oportunidadventa/vistas/BajaOportunidadVenta.tsx";
import { Cliente } from "../../diseño.ts";
import { getOportunidadesVentaCliente } from "../../infraestructura.ts";

type Estado = "Inactivo" | "Creando" | "Borrando" | "Cargando";

type Contexto = {
  oportunidades: ListaSeleccionable<OportunidadVenta>;
};

const configMaquina: ConfigMaquina3<Estado, Contexto> = {
  Cargando: {
    oportunidades_cargadas: (maquina, payload) => {
      return {
        estado: "Inactivo" as Estado,
        contexto: {
          ...maquina.contexto,
          oportunidades: cargarLista(payload as OportunidadVenta[]),
        },
      };
    },
  },
  Inactivo: {
    crear: "Creando",
    borrar: "Borrando",
    oportunidad_seleccionada: ({ contexto, ...maquina }, payload) => {
      return {
        ...maquina,
        contexto: {
          ...contexto,
          oportunidades: seleccionarItemEnLista(
            contexto.oportunidades,
            payload as OportunidadVenta
          ),
        },
      };
    },
    cargar: "Cargando",
  },
  Creando: {
    oportunidad_creada: ({ contexto, ...maquina }, payload: unknown) => {
      return {
        estado: "Inactivo",
        contexto: {
          ...maquina,
          oportunidades: incluirEnLista(
            contexto.oportunidades,
            payload as OportunidadVenta,
            {}
          ),
        },
      };
    },
    creacion_cancelada: "Inactivo",
  },
  Borrando: {
    oportunidad_borrada: ({ contexto, ...maquina }) => {
      if (!contexto.oportunidades.idActivo) {
        return { contexto, ...maquina };
      }
      return {
        estado: "Inactivo",
        contexto: {
          ...contexto,
          oportunidades: quitarDeLista(
            contexto.oportunidades,
            contexto.oportunidades.idActivo
          ),
        },
      };
    },
    borrado_cancelado: "Inactivo",
  },
};

export const TabOportunidades = ({
  cliente,
}: {
  cliente: HookModelo<Cliente>;
}) => {
  const { intentar } = useContext(ContextoError);

  const idCliente = cliente.modelo.id;

  const [emitir, { estado, contexto }] = useMaquina3<Estado, Contexto>(
    configMaquina,
    "Inactivo",
    {
      oportunidades: listaSeleccionableVacia<OportunidadVenta>(),
    }
  );
  const { oportunidades } = contexto;

  useEffect(() => {
    const cargarOportunidades = async () => {
      const nuevasOportunidades = await intentar(() =>
        getOportunidadesVentaCliente(idCliente)
      );
      emitir("oportunidades_cargadas", nuevasOportunidades);
    };
    emitir("cargar");
    cargarOportunidades();
  }, [emitir, idCliente, intentar]);

  return (
    <div className="TabOportunidades">
      <div className="TabOportunidadesOportunidades maestro-botones">
        <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>

        <QBoton
          onClick={() => emitir("borrar")}
          deshabilitado={!oportunidades.idActivo}
        >
          Borrar
        </QBoton>
      </div>

      <AltaOportunidadVenta
        emitir={emitir}
        activo={estado === "Creando"}
        key={cliente.modelo.id}
        idCliente={cliente.modelo.id}
      />

      <BajaOportunidadVenta
        emitir={emitir}
        activo={estado === "Borrando"}
        idOportunidadVenta={oportunidades.idActivo || undefined}
      />

      <QTabla
        metaTabla={metaTablaOportunidadVenta}
        datos={oportunidades.lista}
        cargando={estado === "Cargando"}
        seleccionadaId={oportunidades.idActivo || undefined}
        onSeleccion={(oportunidadventa) =>
          emitir("oportunidad_seleccionada", oportunidadventa)
        }
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </div>
  );
};
