import { useEffect, useState } from "react";
import { DireccionCliente } from "../diseño.ts";
import { Direccion } from "./Direccion.tsx";
import { direccionesFake } from "./direccionesFake.ts";

export const DireccionesCliente = ({ codCliente }: { codCliente: string }) => {
  const [direcciones, setDirecciones] = useState<DireccionCliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DireccionCliente | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const direcciones = direccionesFake.find(
      (direccion) => direccion.codigo_cliente === codCliente
    )?.direcciones;

    if (direcciones) {
      setDirecciones(direcciones);
    } else {
      setError("No se encontraron direcciones para el cliente.");
    }
  }, [codCliente]);

  const editarDireccion = (dir: DireccionCliente) => {
    setSelectedItem(dir);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!direcciones) {
    return <div>Cargando direcciones...</div>;
  }

  return (
    <div>
      <h2>Direcciones del Cliente: {codCliente}</h2>
      <ul>
        {direcciones?.map((direccion) => (
          <li onClick={() => editarDireccion(direccion)} key={direccion.id}>
            {direccion.direccion.nombre_via}
          </li>
        ))}
      </ul>
      {selectedItem && isModalOpen && (
        <div>
          <div>
            <Direccion direccion={selectedItem} />
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
