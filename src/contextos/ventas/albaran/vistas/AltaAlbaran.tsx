import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../comun/diseño.ts";
import { useModelo } from "../../../comun/useModelo.ts";
import { Cliente } from "../../comun/componentes/cliente.tsx";
import { DirCliente } from "../../comun/componentes/dirCliente.tsx";
import { metaNuevoAlbaran, nuevoAlbaranVacio } from "../dominio.ts";
import { getAlbaran, postAlbaran } from "../infraestructura.ts";
import "./AltaAlbaran.css";

export const AltaAlbaran = ({
  publicar = () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const nuevoAlbaran = useModelo(metaNuevoAlbaran, nuevoAlbaranVacio);

  const guardar = async () => {
    const id = await postAlbaran(nuevoAlbaran.modelo);
    const albaranCreado = await getAlbaran(id);
    publicar("ALBARAN_CREADO", albaranCreado);
  };

  return (
    <div className="AltaAlbaran">
      <h2>Nuevo Albarán</h2>
      <quimera-formulario>
        <Cliente {...nuevoAlbaran.uiProps("cliente_id")} />
        <DirCliente
          clienteId={nuevoAlbaran.modelo.cliente_id}
          {...nuevoAlbaran.uiProps("direccion_id")}
        />
        <QInput label="Empresa" {...nuevoAlbaran.uiProps("empresa_id")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={!nuevoAlbaran.valido}>
          Guardar
        </QBoton>
        <QBoton onClick={() => publicar("ALTA_CANCELADA")} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
