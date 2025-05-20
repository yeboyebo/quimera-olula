import { useEffect, useState } from "react";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { Permiso, Regla } from "../../diseño.ts";
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
    const permisoActual = permisos.find(
      (p) =>
        p.id.toUpperCase() === grupoId.toUpperCase() && p.idrule === regla.id
    );
    setPermiso(
      permisoActual
        ? permisoActual.value === true
          ? "true"
          : permisoActual.value === false
          ? "false"
          : "null"
        : "null"
    );
  }, [grupoId, permisos, regla.id]);

  return (
    <div className="AccionesRegla">
      <button
        className={`boton-permitir ${permiso === "true" ? "activo" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("PERMITIR_REGLA", regla);
        }}
      >
        v
      </button>
      <button
        className={`boton-cancelar ${permiso === "false" ? "activo" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("CANCELAR_REGLA", regla);
        }}
      >
        c
      </button>
      <button
        className={`boton-borrar ${permiso === "null" ? "activo" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          emitir("BORRAR_REGLA", regla);
        }}
      >
        -
      </button>
    </div>
  );
};
