import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ProcesarEvento, useMaquina } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useEffect, useMemo, useState } from "react";
import { Tramo } from "../../../diseño.ts";
import { EstadoTarjetaTramo } from "./diseño.ts";
import { construirTramoGuardado } from "./dominio.ts";
import { getMaquinaTramo } from "./maquina.ts";
import "./TarjetaTramo.css";
import { crearMetaTramoEditable, tramoEditableInicial } from "./tramo.ts";

export const TarjetaTramo = ({
  tramo,
  maximoPermitido,
  deshabilitado,
  usaLotes,
  usaUbicaciones,
  lineaId,
  publicar,
}: {
  tramo: Tramo;
  maximoPermitido: number;
  deshabilitado: boolean;
  usaLotes: boolean;
  usaUbicaciones: boolean;
  lineaId: string;
  publicar: ProcesarEvento;
}) => {
  const [estado, setEstado] = useState<EstadoTarjetaTramo>("EDITANDO");
  const setEstadoMaquina = (nuevoEstado: string) => {
    setEstado(nuevoEstado as EstadoTarjetaTramo);
  };
  const emitir = useMaquina(getMaquinaTramo(), estado, setEstadoMaquina);

  const modeloInicial = useMemo(
    () => tramoEditableInicial(tramo, maximoPermitido),
    [tramo, maximoPermitido]
  );

  const { modelo, uiProps, valido, init } = useModelo(
    crearMetaTramoEditable(usaLotes, usaUbicaciones),
    modeloInicial
  );

  useEffect(() => {
    init(modeloInicial);
  }, [init, modeloInicial]);

  const guardar = async (event?: React.MouseEvent) => {
    event?.stopPropagation();
    emitir("guardar_solicitado");
    try {
      const tramoGuardado = construirTramoGuardado({
        tramo,
        lote_id: modelo.lote_id,
        ubicacion_id: modelo.ubicacion_id,
        cantidad: modelo.cantidad,
        usaLotes,
        usaUbicaciones,
      });

      publicar("tramo_actualizado", { id: lineaId, tramo: tramoGuardado });
      setEstado("EDITANDO");
    } catch {
      setEstado("EDITANDO");
    }
  };

  return (
    <div
      className={`TarjetaTramo ${!usaLotes ? "sin-lotes" : ""} ${!usaUbicaciones ? "sin-ubicaciones" : ""}`.trim()}
    >
      <quimera-formulario>
        {usaLotes && (
          <QInput
            label="Lote"
            {...uiProps("lote_id")}
            deshabilitado={deshabilitado}
          />
        )}
        {usaUbicaciones && (
          <QInput
            label="Ubicación"
            {...uiProps("ubicacion_id")}
            deshabilitado={deshabilitado}
          />
        )}
        <QInput
          label="Cantidad"
          {...uiProps("cantidad")}
          deshabilitado={deshabilitado}
        />
      </quimera-formulario>

      <div className="tramo-maximo">Máximo permitido: {maximoPermitido}</div>

      <div className="botones maestro-botones">
        <QBoton
          onClick={(event) => guardar(event)}
          deshabilitado={deshabilitado || !valido || estado === "GUARDANDO"}
        >
          {estado === "GUARDANDO" ? "Guardando..." : "Guardar"}
        </QBoton>
      </div>
    </div>
  );
};
