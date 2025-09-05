import { useCallback } from "react";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { Presupuesto } from "../diseño.ts";
import { getPresupuestos } from "../infraestructura.ts";

import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import { cambiarItem, cargar, getSeleccionada, incluirItem, listaSeleccionableVacia, quitarItem, quitarSeleccion, seleccionarItem } from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import { ConfigMaquina4, Maquina3, useMaquina4 } from "../../../comun/useMaquina.ts";
import { CrearPresupuesto } from "./DetallePresupuesto/CrearPresupuesto.tsx";
import { DetallePresupuesto } from "./DetallePresupuesto/DetallePresupuesto.tsx";

const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
  {
    id: "codigo",
    cabecera: "Código",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
  },
  {
    id: "total",
    cabecera: "Total",
    tipo: "moneda",
  },
];

type Estado = "Inactivo" | "Creando";

type Contexto = {
  presupuestos: ListaSeleccionable<Presupuesto>;
};

const setPresupuestos =
  (
    aplicable: (
      presupuestos: ListaSeleccionable<Presupuesto>
    ) => ListaSeleccionable<Presupuesto>
  ) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        presupuestos: aplicable(maquina.contexto.presupuestos),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "Inactivo",
    contexto: {
      presupuestos: listaSeleccionableVacia<Presupuesto>(),
    },
  },
  estados: {
    Inactivo: {
      crear: "Creando",
      presupuesto_cambiado: ({ maquina, payload }) =>
        pipe(
          maquina,
          setPresupuestos(cambiarItem(payload as Presupuesto))
        ),
      presupuesto_seleccionado: ({ maquina, payload }) =>
        pipe(
          maquina,
          setPresupuestos(seleccionarItem(payload as Presupuesto))
        ),
      seleccion_presupuesto_cancelada: ({ maquina }) =>
        pipe(
          maquina,
          setPresupuestos(quitarSeleccion())
        ),
      presupuesto_borrado: ({ maquina }) => {
        const { presupuestos } = maquina.contexto;
        if (!presupuestos.idActivo) {
          return maquina;
        }
        return pipe(
          maquina,
          setPresupuestos(quitarItem(presupuestos.idActivo))
        );
      },
      presupuestos_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPresupuestos(cargar(payload as Presupuesto[]))
        ),
    },
    Creando: {
      presupuesto_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("Inactivo" as Estado),
          setPresupuestos(incluirItem(payload as Presupuesto, {}))
        ),
      creacion_presupuesto_cancelada: "Inactivo",
    },
  },
};

export const MaestroConDetallePresupuesto = () => {
  
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
      config: configMaquina,
  });
  const { presupuestos } = contexto;

  const setEntidades = useCallback(
    (payload: Presupuesto[]) => emitir("presupuestos_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Presupuesto) => emitir("presupuesto_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(presupuestos);

  return (
    <div className="Presupuesto">
      <MaestroDetalleResponsive<Presupuesto>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Presupuestos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>
                Crear Presupuesto
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaPresupuesto}
              entidades={presupuestos.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getPresupuestos}
            />
          </>
        }
        Detalle={
          <DetallePresupuesto
            presupuestoInicial={seleccionada}
            publicar={emitir}
          />
        }
      />
      <CrearPresupuesto publicar={emitir} activo={estado === "Creando"} />
    </div>
  );
};
