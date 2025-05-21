import { useEffect, useState } from "react";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { Permiso, Regla } from "../../diseño.ts";
import { calcularClasesExtra, calcularPermiso } from "../../dominio.ts";
import "./AccionesRegla.css";

export const AccionesRegla = ({
  regla,
  permisos,
  grupoId,
  emitir,
}: {
  regla: Regla;
  permisos: Permiso[];
  grupoId: string;
  emitir: EmitirEvento;
}) => {
  const [permiso, setPermiso] = useState<"true" | "false" | "null">("null");

  useEffect(() => {
    setPermiso(calcularPermiso(permisos, grupoId, regla.id));
  }, [grupoId, permisos, regla.id]);

  const clasesExtra = calcularClasesExtra(regla.id);

  return (
    <div className="AccionesRegla">
      <button
        className={`boton-nulo ${
          permiso === "null" ? "activo" : ""
        } ${clasesExtra}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("BORRAR_REGLA", regla);
        }}
      >
        -
      </button>
      <button
        className={`boton-cancelar ${
          permiso === "false" ? "activo" : ""
        } ${clasesExtra}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("CANCELAR_REGLA", regla);
        }}
      >
        c
      </button>
      <button
        className={`boton-permitir ${
          permiso === "true" ? "activo" : ""
        } ${clasesExtra}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("PERMITIR_REGLA", regla);
        }}
      >
        v
      </button>
    </div>
  );
};
