import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { NuevoPresupuesto, Presupuesto } from "../diseño.ts";
import { validadoresPresupuesto } from "../dominio.ts";
import {
  camposPresupuesto,
  getPresupuesto,
  postPresupuesto,
} from "../infraestructura.ts";

export const AltaPresupuesto = ({
  onPresupuestoCreado = () => {},
  onCancelar,
}: {
  onPresupuestoCreado?: (presupuesto: Presupuesto) => void;
  onCancelar: () => void;
}) => {
  const [guardando, setGuardando] = useState(false);
  const [presupuesto, setPresupuesto] = useState<NuevoPresupuesto>({
    cliente_id: "",
    direccion_id: "",
    fecha: "",
    empresa_id: "1", // Valor por defecto
  });

  const onCambio = (campo: string, valor: string) => {
    const nuevoPresupuesto = { ...presupuesto, [campo]: valor };
    setPresupuesto(nuevoPresupuesto);
  };

  const onGuardarClicked = async () => {
    setGuardando(true);
    const id = await postPresupuesto(presupuesto);
    const nuevoPresupuesto = await getPresupuesto(id);
    setGuardando(false);
    onPresupuestoCreado(nuevoPresupuesto);
  };

  return (
    <>
      <h2>Nuevo Presupuesto</h2>
      <Input
        controlado
        key="cliente_id"
        campo={camposPresupuesto.cliente_id}
        onCampoCambiado={onCambio}
        valorEntidad={presupuesto.cliente_id}
        validador={validadoresPresupuesto.cliente_id}
      />
      <Input
        controlado
        key="direccion_id"
        campo={camposPresupuesto.direccion_id}
        onCampoCambiado={onCambio}
        valorEntidad={presupuesto.direccion_id}
        validador={validadoresPresupuesto.direccion_id}
      />
      <Input
        controlado
        key="fecha"
        campo={camposPresupuesto.fecha}
        onCampoCambiado={onCambio}
        valorEntidad={presupuesto.fecha}
        validador={validadoresPresupuesto.fecha}
      />
      <Input
        controlado
        key="empresa_id"
        campo={camposPresupuesto.empresa_id}
        onCampoCambiado={onCambio}
        valorEntidad={presupuesto.empresa_id}
      />
      <button
        onClick={onGuardarClicked}
        disabled={
          !validadoresPresupuesto.nuevoPresupuesto(presupuesto) || guardando
        }
      >
        Guardar
      </button>
      <button onClick={onCancelar}>Cancelar</button>
    </>
  );
};
