import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QIcono } from "../../../../componentes/atomos/qicono.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { ReglaAnidada, ReglaConValor } from "../../diseño.ts";
import { calcularClasesExtra } from "../../dominio.ts";
import "./AccionesRegla.css";

export const AccionesRegla = ({
  reglaPadre,
  regla,
  emitir,
}: {
  reglaPadre?: ReglaAnidada;
  regla: ReglaConValor | ReglaAnidada;
  grupoId: string;
  emitir: EmitirEvento;
}) => {
  const clasesExtra = calcularClasesExtra(regla, reglaPadre);

  return (
    <div className="AccionesRegla">
      <div className={`boton-nulo ${regla.valor === null ? "activo" : ""}`}>
        <QBoton
          variante="borde"
          onClick={() => {
            emitir("BORRAR_REGLA", regla);
          }}
        >
          <QIcono nombre="minus" tamaño="sm" />
        </QBoton>
      </div>
      <div
        className={`boton-cancelar ${regla.valor === false ? "activo" : ""} ${
          clasesExtra.cancelar
        }`}
      >
        <QBoton
          variante="borde"
          onClick={() => {
            emitir("CANCELAR_REGLA", regla);
          }}
        >
          <QIcono nombre="x_circle" tamaño="sm" />
        </QBoton>
      </div>
      <div
        className={`boton-permitir ${regla.valor === true ? "activo" : ""} ${
          clasesExtra.permitir
        }`}
      >
        <QBoton
          variante="borde"
          onClick={() => {
            emitir("PERMITIR_REGLA", regla);
          }}
        >
          <QIcono nombre="check" tamaño="sm" />
        </QBoton>
      </div>
    </div>
  );
};
