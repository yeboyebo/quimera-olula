import React from "react";
import {
  CampoFormularioGenerico,
  FormularioGenerico,
} from "./FormularioGenerico";
import { DetailRelacionados } from "./DetailRelacionados";

interface DetailProps<T, R> {
  entity: T;
  relatedEntity?: R[];
  renderCabecera: (item: T) => React.ReactNode;
  renderRelated?: () => React.ReactNode;
  actualizarUno: (entidad: Partial<T>) => Promise<void>;
  camposRelatedItems?: CampoFormularioGenerico[] | [];
  camposEntidad: CampoFormularioGenerico[];
  actualizarUnRelacionado?: (items: R[]) => void;
  actions?: React.ReactNode;
}

export function Detail<T, R>({
  entity,
  renderCabecera,
  camposEntidad,
  relatedEntity,
  camposRelatedItems,
  renderRelated,
  actualizarUno,
  actualizarUnRelacionado,
  actions,
}: DetailProps<T, R>) {
  return (
    <div>
      {actions && <div>{actions}</div>}
      <h2>{renderCabecera(entity)}</h2>
      <FormularioGenerico
        campos={camposEntidad}
        valoresIniciales={entity}
        onSubmit={actualizarUno}
      />
      {relatedEntity && actualizarUnRelacionado && (
        <DetailRelacionados
          entityRelacionado={relatedEntity}
          actualizarUnRelacionado={actualizarUnRelacionado}
          camposRelatedItems={camposRelatedItems}
        />
      )}
      {renderRelated && <div>{renderRelated()}</div>}
    </div>
  );
}
