import { ModLin } from "../diseño.js";

export const TabInformacion = ({ modLin }: { modLin: ModLin }) => {
  return (
    <div className="TabInformacion">
      <div className="info-grupo">
        <h4>Detalles del Módulo</h4>
        <p>
          <strong>ID:</strong> {modLin.id}
        </p>
        <p>
          <strong>Campo String:</strong> {modLin.campoString}
        </p>
      </div>
    </div>
  );
};
