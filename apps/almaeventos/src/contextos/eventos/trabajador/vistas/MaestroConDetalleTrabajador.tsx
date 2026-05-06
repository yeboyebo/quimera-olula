import { MetaTabla, QBoton, QModal } from "@olula/componentes/index.ts";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useCallback, useEffect, useState } from "react";
import { Trabajador } from "../diseño.ts";
import { getTrabajadores } from "../infraestructura.ts";
import { AltaTrabajador } from "./AltaTrabajador.tsx";
import { DetalleTrabajador } from "./DetalleTrabajador/DetalleTrabajador.tsx";
// import "./MaestroConDetalleTrabajador.css";

const metaTablaTrabajador: MetaTabla<Trabajador> = [
  // { id: "id", cabecera: "Código" },
  { id: "nombre", cabecera: "Nombre" },
  { id: "coste", cabecera: "Coste/Hora" },
];
type Estado = "lista" | "alta";

export const MaestroConDetalleTrabajador = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const [criteria, setCriteria] = useState<Criteria>(criteriaDefecto);
  const [cargando, setCargando] = useState(false);
  const [totalTrabajadores, setTotalTrabajadores] = useState(0);
  const trabajadores = useLista<Trabajador>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      TRABAJADOR_CREADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.añadir(trabajador);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      TRABAJADOR_CAMBIADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.modificar(trabajador);
      },
      TRABAJADOR_BORRADO: (payload: unknown) => {
        const trabajador = payload as Trabajador;
        trabajadores.eliminar(trabajador);
      },
      CANCELAR_SELECCION: () => {
        trabajadores.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const recargar = useCallback(
    async (nuevaCriteria: Criteria) => {
      setCriteria(nuevaCriteria);
      setCargando(true);
      const { datos, total } = await getTrabajadores(
        nuevaCriteria.filtro,
        nuevaCriteria.orden,
        nuevaCriteria.paginacion
      );
      trabajadores.setLista(datos);
      setTotalTrabajadores(total);
      setCargando(false);
    },
    [trabajadores]
  );

  useEffect(() => {
    void recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Trabajador">
      <MaestroDetalle<Trabajador>
        seleccionada={trabajadores.seleccionada?.id}
        Maestro={
          <>
            <h2>Trabajadores</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
            </div>
            <Listado<Trabajador>
              metaTabla={metaTablaTrabajador}
              criteria={criteria}
              criteriaInicial={criteriaDefecto}
              cargando={cargando}
              entidades={trabajadores.lista}
              totalEntidades={totalTrabajadores}
              seleccionada={trabajadores.seleccionada?.id}
              onSeleccion={(id) => {
                const trabajador = trabajadores.lista.find(
                  (item) => item.id === id
                );
                if (trabajador) trabajadores.seleccionar(trabajador);
              }}
              onCriteriaChanged={(nuevaCriteria) =>
                void recargar(nuevaCriteria)
              }
            />
          </>
        }
        Detalle={
          <DetalleTrabajador
            trabajadorInicial={trabajadores.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaTrabajador emitir={emitir} />
      </QModal>
    </div>
  );
};
