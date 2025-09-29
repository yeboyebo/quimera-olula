import { useCallback } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { ListaSeleccionable } from "../../../comun/diseño.ts";
import {
  cambiarItem,
  cargar,
  getSeleccionada,
  incluirItem,
  listaSeleccionableVacia,
  quitarItem,
  seleccionarItem,
} from "../../../comun/entidad.ts";
import { pipe } from "../../../comun/funcional.ts";
import {
  ConfigMaquina4,
  Maquina3,
  useMaquina4,
} from "../../../comun/useMaquina.ts";
import { Lead } from "../diseño.ts";
import { getLeads } from "../infraestructura.ts";
import { AltaLead } from "./AltaLead.tsx";
import { DetalleLead } from "./DetalleLead/DetalleLead.tsx";
// import "./MaestroConDetalleLead.css";

const metaTablaLead: MetaTabla<Lead> = [
  { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "tipo", cabecera: "Tipo" },
  { id: "estado_id", cabecera: "Estado" },
  { id: "fuente_id", cabecera: "Fuente" },
];

type Estado = "inactivo" | "creando";

type Contexto = {
  leads: ListaSeleccionable<Lead>;
};

const setLeads =
  (aplicable: (leads: ListaSeleccionable<Lead>) => ListaSeleccionable<Lead>) =>
  (maquina: Maquina3<Estado, Contexto>) => {
    return {
      ...maquina,
      contexto: {
        ...maquina.contexto,
        leads: aplicable(maquina.contexto.leads),
      },
    };
  };

const configMaquina: ConfigMaquina4<Estado, Contexto> = {
  inicial: {
    estado: "inactivo",
    contexto: {
      leads: listaSeleccionableVacia<Lead>(),
    },
  },
  estados: {
    inactivo: {
      crear: "creando",
      lead_cambiado: ({ maquina, payload }) =>
        pipe(maquina, setLeads(cambiarItem(payload as Lead))),
      lead_seleccionado: ({ maquina, payload }) =>
        pipe(maquina, setLeads(seleccionarItem(payload as Lead))),
      lead_borrado: ({ maquina }) => {
        const { leads } = maquina.contexto;
        if (!leads.idActivo) {
          return maquina;
        }
        return pipe(maquina, setLeads(quitarItem(leads.idActivo)));
      },
      leads_cargados: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setLeads(cargar(payload as Lead[]))
        ),
    },
    creando: {
      lead_creado: ({ maquina, payload, setEstado }) =>
        pipe(
          maquina,
          setEstado("inactivo" as Estado),
          setLeads(incluirItem(payload as Lead, {}))
        ),
      creacion_cancelada: "inactivo",
    },
  },
};

export const MaestroConDetalleLead = () => {
  const [emitir, { estado, contexto }] = useMaquina4<Estado, Contexto>({
    config: configMaquina,
  });
  const { leads } = contexto;

  const setEntidades = useCallback(
    (payload: Lead[]) => emitir("leads_cargados", payload),
    [emitir]
  );
  const setSeleccionada = useCallback(
    (payload: Lead) => emitir("lead_seleccionado", payload),
    [emitir]
  );

  const seleccionada = getSeleccionada(leads);

  return (
    <div className="Lead">
      <MaestroDetalleResponsive<Lead>
        seleccionada={seleccionada}
        Maestro={
          <>
            <h2>Leads</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("crear")}>Nuevo</QBoton>
            </div>
            <Listado
              metaTabla={metaTablaLead}
              entidades={leads.lista}
              setEntidades={setEntidades}
              seleccionada={seleccionada}
              setSeleccionada={setSeleccionada}
              cargar={getLeads}
            />
          </>
        }
        Detalle={<DetalleLead leadInicial={seleccionada} publicar={emitir} />}
      />
      <AltaLead emitir={emitir} activo={estado === "creando"} />
    </div>
  );
};
