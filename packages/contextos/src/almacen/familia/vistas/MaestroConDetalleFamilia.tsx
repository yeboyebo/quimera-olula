import { MaestroDetalle, QBoton } from "@olula/componentes/index.ts";
import { ListaSeleccionable } from "@olula/lib/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "@olula/lib/entidad.ts";
import { pipe } from "@olula/lib/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "@olula/lib/useMaquina.ts";
import { useCallback } from "react";
import { Familia } from "../diseño.ts";
import { metaTablaFamilia } from "../dominio.ts";
import { getFamilias } from "../infraestructura.ts";
import { CrearFamilia } from "./CrearFamilia.tsx";
import { DetalleFamilia } from "./DetalleFamilia/DetalleFamilia.tsx";

type Estado = "Inactivo" | "Creando";

type Contexto = {
  familias: ListaSeleccionable<Familia>;
};

const setFamilias =
  (
    aplicable: (
      familias: ListaSeleccionable<Familia>
    ) => ListaSeleccionable<Familia>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        familias: aplicable(maquina.contexto.familias),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      familias: listaSeleccionableVacia<Familia>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      familia_cambiada: ({ maquina, payload }) =>
        pipe(maquina, setFamilias(cambiarItem(payload as Familia))),
      familia_seleccionada: ({ maquina, payload }) =>
        pipe(maquina, setFamilias(seleccionarItem(payload as Familia))),
      familia_borrada: ({ maquina }) => {
        const { familias } = maquina.contexto;
        if (!familias.idActivo) {
          return maquina;
        }
        return pipe(maquina, setFamilias(quitarItem(familias.idActivo)));
      },
      familias_cargadas: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setFamilias(cargar(payload as Familia[]))
        ),
      seleccion_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setFamilias((familias) => ({
            ...familias,
            idActivo: null,
          }))
        ),
    },
    Creando: {
      familia_creada: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setFamilias(incluirItem(payload as Familia, {}))
        ),
      creacion_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetalleFamilia = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { familias } = contexto;

  const setEntidades = useCallback(
    (payload: Familia[]) => emitir("familias_cargadas", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Familia) => emitir("familia_seleccionada", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(familias);

  return (
    <div className="Familia">
      <MaestroDetalle<Familia>
        seleccionada={seleccionada}
        preMaestro={
          <>
            <h2>Familias</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nueva</QBoton>
            </div>
          </>
        }
        metaTabla={metaTablaFamilia}
        entidades={familias.lista}
        setEntidades={setEntidades}
        setSeleccionada={setSeleccionada}
        cargar={getFamilias}
        Detalle={
          <DetalleFamilia
            key={seleccionada?.id}
            familiaInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearFamilia publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
