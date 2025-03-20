import { Maestro } from "../../../../componentes/maestro/Maestro.tsx";
import { accionesCliente, camposCliente } from "../infraestructura.ts";
import { DetalleCliente } from "./DetalleCliente.tsx";

export const MaestroConDetalleCliente = () => {
  return (
    <>
      <div
        className="Maestro"
        style={{
          width: "50%",
          overflowX: "hidden",
        }}
      >
        <Maestro acciones={accionesCliente} camposEntidad={camposCliente} />
      </div>
      <div className="Detalle" style={{ width: "50%", overflowX: "hidden" }}>
        <DetalleCliente />
      </div>
    </>
  );
};
