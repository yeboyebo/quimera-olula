import { Filtro } from "@olula/lib/diseño.ts";
import { useState } from "react";
import { QBoton } from "../../atomos/qboton.tsx";
import { QIcono } from "../../atomos/qicono.tsx";
import { QInput } from "../../atomos/qinput.tsx";
import { QSelect } from "../../atomos/qselect.tsx";
import { QTarjetaResumen } from "../../atomos/qtarjeta_resumen.tsx";
import { QModal } from "../../moleculas/qmodal.tsx";
import {
  ConfigWidgets,
  DefinicionWidget,
  FormatoWidget,
  OperacionWidget,
} from "./diseño.ts";
import {
  formatearValorWidget,
  formatosWidget,
  MAX_WIDGETS,
  nuevoWidget,
  operacionesWidget,
  pieWidget,
} from "./dominio.ts";
import "./PersonalizarWidgets.css";
import { useTotalesWidgets } from "./useTotalesWidgets.ts";

type PersonalizarWidgetsProps = {
  config: ConfigWidgets;
  widgets: DefinicionWidget[];
  filtro: Filtro | undefined;
  onGuardar: (widgets: DefinicionWidget[]) => Promise<void>;
  onRestaurar: () => Promise<void>;
  onCerrar: () => void;
};

/** Panel lateral para elegir qué totales se ven encima del listado. */
export const PersonalizarWidgets = ({
  config,
  widgets,
  filtro,
  onGuardar,
  onRestaurar,
  onCerrar,
}: PersonalizarWidgetsProps) => {
  const [borrador, setBorrador] = useState(widgets);
  const [titulo, setTitulo] = useState("");
  const sinMedidas = config.campos.length === 0;
  const [operacion, setOperacion] = useState<OperacionWidget>(
    sinMedidas ? "conteo" : "suma"
  );
  const [campoId, setCampoId] = useState(config.campos[0]?.id ?? "");
  // El formato sale del campo; el usuario lo puede cambiar (en los maestros sin
  // widgets propios se deduce del nombre de la medida y puede no acertar).
  const [formatoElegido, setFormatoElegido] = useState<FormatoWidget>();
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const campo = config.campos.find((c) => c.id === campoId);
  const formato = formatoElegido ?? campo?.formato ?? "numero";
  const propuesto = nuevoWidget(
    titulo || "Nuevo widget",
    operacion,
    campo,
    borrador,
    formato
  );
  const { valores, cargando } = useTotalesWidgets(
    { ...config, widgets: [propuesto] },
    filtro
  );

  const idsPorDefecto = new Set(config.widgets.map((w) => w.id));
  const lleno = borrador.length >= MAX_WIDGETS;

  const mover = (indice: number, desplazamiento: number) => {
    const destino = indice + desplazamiento;
    if (destino < 0 || destino >= borrador.length) return;
    const copia = [...borrador];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    setBorrador(copia);
  };

  const anadir = () => {
    if (!titulo.trim() || lleno) return;
    setBorrador([
      ...borrador,
      nuevoWidget(titulo, operacion, campo, borrador, formato),
    ]);
    setTitulo("");
  };

  const ejecutar = async (accion: () => Promise<void>) => {
    setGuardando(true);
    setError(null);
    try {
      await accion();
      onCerrar();
    } catch {
      setError("No se ha podido guardar. Inténtalo de nuevo.");
      setGuardando(false);
    }
  };

  return (
    <QModal
      nombre="personalizar-widgets"
      titulo={`Widgets de ${config.titulo}`}
      abierto={true}
      onCerrar={onCerrar}
      pantallaCompletaMovil
    >
      <div className="personalizar-widgets">
        <p className="personalizar-widgets-ayuda">
          Se calculan sobre los filtros activos del listado.
        </p>

        <section aria-labelledby="widgets-visibles">
          <h3 id="widgets-visibles">Visibles</h3>
          {borrador.length === 0 && (
            <p className="personalizar-widgets-vacio">
              No hay widgets. Añade alguno abajo.
            </p>
          )}
          <ul className="personalizar-widgets-lista">
            {borrador.map((widget, indice) => (
              <li key={widget.id}>
                <div className="personalizar-widgets-texto">
                  <span className="titulo">{widget.titulo}</span>
                  <span className="descripcion">
                    {pieWidget(widget, config.campos)}
                  </span>
                </div>
                {idsPorDefecto.has(widget.id) && (
                  <span className="personalizar-widgets-defecto">
                    Por defecto
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Subir ${widget.titulo}`}
                  disabled={indice === 0}
                  onClick={() => mover(indice, -1)}
                >
                  <QIcono nombre="arriba" tamaño="sm" />
                </button>
                <button
                  type="button"
                  aria-label={`Bajar ${widget.titulo}`}
                  disabled={indice === borrador.length - 1}
                  onClick={() => mover(indice, 1)}
                >
                  <QIcono nombre="abajo" tamaño="sm" />
                </button>
                <button
                  type="button"
                  aria-label={`Quitar ${widget.titulo}`}
                  onClick={() =>
                    setBorrador(borrador.filter((w) => w.id !== widget.id))
                  }
                >
                  <QIcono nombre="eliminar" tamaño="sm" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="widget-nuevo"
          className="personalizar-widgets-nuevo"
        >
          <h3 id="widget-nuevo">Nuevo widget</h3>
          <QInput
            label="Título"
            nombre="titulo_widget"
            valor={titulo}
            maxLength={60}
            onChange={(valor) => setTitulo(valor)}
          />
          <QSelect
            label="Cálculo"
            nombre="operacion_widget"
            valor={operacion}
            opciones={
              sinMedidas
                ? operacionesWidget.filter((o) => o.valor === "conteo")
                : operacionesWidget
            }
            onChange={(opcion) =>
              opcion && setOperacion(opcion.valor as OperacionWidget)
            }
          />
          {operacion !== "conteo" && (
            <>
              <QSelect
                label="Campo"
                nombre="campo_widget"
                valor={campoId}
                opciones={config.campos.map((c) => ({
                  valor: c.id,
                  descripcion: c.etiqueta,
                }))}
                onChange={(opcion) => {
                  if (!opcion) return;
                  setCampoId(opcion.valor);
                  setFormatoElegido(undefined);
                }}
              />
              <QSelect
                label="Formato"
                nombre="formato_widget"
                valor={formato}
                opciones={formatosWidget}
                onChange={(opcion) =>
                  opcion && setFormatoElegido(opcion.valor as FormatoWidget)
                }
              />
            </>
          )}

          <div className="personalizar-widgets-previa">
            <span>Vista previa</span>
            <QTarjetaResumen
              titulo={propuesto.titulo}
              valor={formatearValorWidget(valores[propuesto.id], propuesto)}
              pie={pieWidget(propuesto, config.campos)}
              cargando={cargando}
            />
          </div>

          <QBoton
            variante="borde"
            deshabilitado={!titulo.trim() || lleno}
            onClick={anadir}
          >
            Añadir al panel
          </QBoton>
          {lleno && (
            <p className="personalizar-widgets-vacio">
              Como máximo {MAX_WIDGETS} widgets.
            </p>
          )}
        </section>

        {error && (
          <p className="personalizar-widgets-error" role="alert">
            {error}
          </p>
        )}

        <footer className="personalizar-widgets-pie">
          <QBoton
            variante="texto"
            deshabilitado={guardando}
            onClick={() => ejecutar(onRestaurar)}
          >
            Restaurar por defecto
          </QBoton>
          <div>
            <QBoton variante="borde" onClick={onCerrar}>
              Cancelar
            </QBoton>
            <QBoton
              deshabilitado={guardando}
              onClick={() => ejecutar(() => onGuardar(borrador))}
            >
              Guardar
            </QBoton>
          </div>
        </footer>
      </div>
    </QModal>
  );
};
