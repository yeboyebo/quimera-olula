import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal, QTextArea } from "@olula/componentes/index.js";
import { useEffect, useMemo, useState } from "react";
import { MotivoDevolucion } from "../../../motivoDevolucion/diseño.ts";
import { getMotivosDevolucion } from "../../../motivoDevolucion/infraestructura.ts";

const ordenarPorDescripcion = (a: MotivoDevolucion, b: MotivoDevolucion) =>
  String(a.descripcion ?? "").localeCompare(String(b.descripcion ?? ""), "es", {
    sensitivity: "base",
  });

const esTipoInterno = (tipo: string) => tipo.trim().toLowerCase() === "interno";

const BotonMotivo = ({
  motivo,
  seleccionado,
  onClick,
}: {
  motivo: MotivoDevolucion;
  seleccionado: boolean;
  onClick: () => void;
}) => (
  <QBoton variante={seleccionado ? "solido" : "borde"} onClick={onClick}>
    {motivo.descripcion || "Otro"}
  </QBoton>
);

export const PasoMotivoDevolucionModal = ({
  abierto,
  guardando,
  motivoSeleccionado,
  descripcionMotivo,
  onCerrar,
  onGuardar,
  onMotivoSeleccionado,
  onDescripcionMotivoCambiada,
}: {
  abierto: boolean;
  guardando: boolean;
  motivoSeleccionado: MotivoDevolucion | null;
  descripcionMotivo: string;
  onCerrar: () => void;
  onGuardar: () => void;
  onMotivoSeleccionado: (motivo: MotivoDevolucion) => void;
  onDescripcionMotivoCambiada: (descripcion: string) => void;
}) => {
  const [motivos, setMotivos] = useState<MotivoDevolucion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!abierto) return;

    const cargarMotivos = async () => {
      setCargando(true);
      setError("");
      try {
        const respuesta = await getMotivosDevolucion([], ["tipo", "ASC"], {
          limite: 200,
          pagina: 1,
        });
        setMotivos((respuesta.datos ?? []).slice().sort(ordenarPorDescripcion));
      } catch {
        setError("No se han podido cargar los motivos de devolución");
      } finally {
        setCargando(false);
      }
    };

    cargarMotivos();
  }, [abierto]);

  const { internos, externos } = useMemo(() => {
    const internos = motivos.filter((motivo) => esTipoInterno(motivo.tipo));
    const externos = motivos.filter((motivo) => !esTipoInterno(motivo.tipo));
    return { internos, externos };
  }, [motivos]);

  const descripcionInformada = descripcionMotivo.trim().length > 0;
  const esOtros = !!motivoSeleccionado?.otros;
  const puedeGuardar =
    !!motivoSeleccionado && (!esOtros || descripcionInformada) && !guardando;

  return (
    <QModal
      abierto={abierto}
      nombre="motivo_devolucion"
      titulo="Motivo de devolución"
      onCerrar={onCerrar}
    >
      <div className="motivo-devolucion-modal">
        {cargando && <p>Cargando motivos...</p>}
        {!cargando && error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && (
          <>
            <section className="motivo-devolucion-seccion">
              <h4>Motivos internos</h4>
              <div className="motivo-devolucion-botones">
                {internos.map((motivo) => (
                  <BotonMotivo
                    key={motivo.id}
                    motivo={motivo}
                    seleccionado={motivoSeleccionado?.id === motivo.id}
                    onClick={() => onMotivoSeleccionado(motivo)}
                  />
                ))}
              </div>
            </section>

            <section className="motivo-devolucion-seccion">
              <h4>Motivos externos</h4>
              <div className="motivo-devolucion-botones">
                {externos.map((motivo) => (
                  <BotonMotivo
                    key={motivo.id}
                    motivo={motivo}
                    seleccionado={motivoSeleccionado?.id === motivo.id}
                    onClick={() => onMotivoSeleccionado(motivo)}
                  />
                ))}
              </div>
            </section>

            <quimera-formulario>
              <QTextArea
                label="Descripción motivo"
                nombre="descripcion_motivo"
                valor={descripcionMotivo}
                onChange={(valor) =>
                  onDescripcionMotivoCambiada(String(valor ?? ""))
                }
                deshabilitado={!esOtros}
              />
            </quimera-formulario>

            <div className="botones">
              <QBoton onClick={onGuardar} deshabilitado={!puedeGuardar}>
                Guardar
              </QBoton>
              <QBoton variante="texto" onClick={onCerrar}>
                Cancelar
              </QBoton>
            </div>
          </>
        )}
      </div>
    </QModal>
  );
};
