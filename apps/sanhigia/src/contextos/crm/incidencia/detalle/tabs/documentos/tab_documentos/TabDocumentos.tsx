import { QArbolDocumentos } from "@olula/componentes/index.js";
// import { QListaDocumentos } from "../../../../../../../../../../packages/componentes/src/lista_documentos/QListaDocumentos";

const TAMANIO_MAXIMO_BYTES = 20 * 1024 * 1024; // 20 MB

export const TabDocumentos = ({ incidenciaId }: { incidenciaId: string }) => {
  return (
    <div className="TabDocumentos">
      <QArbolDocumentos
        tipoObjeto="incidencia"
        objetoId={incidenciaId}
        tamanioMaximoBytes={TAMANIO_MAXIMO_BYTES}
      />
      {/* <QListaDocumentos
        vinculoTipo="incidencia"
        vinculoId={incidenciaId}
        // tamanioMaximoBytes={TAMANIO_MAXIMO_BYTES}
      /> */}
    </div>
  );
};
