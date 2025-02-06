import React, { useState } from "react";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "./FormularioGenerico";

interface DetailRelacionadosProps<R> {
  actualizarUnRelacionado: (items: R[]) => void;
  entityRelacionado: R[];
  camposRelatedItems?: CampoFormularioGenerico[];
}

export function DetailRelacionados<R>({
  entityRelacionado,
  actualizarUnRelacionado,
  camposRelatedItems,
}: DetailRelacionadosProps<R>) {
  const [selectedItem, setSelectedItem] = useState<R | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const editarEntidadRelacionada = (item: R) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSave = (updatedItem: R) => {
    console.log("guardamos relacionado", updatedItem);
    setModalOpen(false);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  if (!camposRelatedItems) {
    return <>Loading...</>;
  }

  return (
    <div>
      <h3>Direcciones</h3>
      <ul>
        {entityRelacionado.map((item, index) => (
          <li key={index}>
            <span>{(item as any).descripcion}</span>
            <button onClick={() => editarEntidadRelacionada(item)}>
              Editar
            </button>
          </li>
        ))}
      </ul>
      {selectedItem && isModalOpen && (
        <div>
          <div>
            <FormularioGenerico
              campos={camposRelatedItems}
              valoresIniciales={entityRelacionado}
              onSubmit={actualizarUnRelacionado}
            />
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
