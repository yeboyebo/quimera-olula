import { QInput } from "../../../../../componentes/atomos/qinput.tsx";
import { EmitirEvento } from "../../../../comun/diseño.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Contacto } from "../../diseño.ts";
import "./TabGeneral.css";

interface TabGeneralProps {
  contacto: HookModelo<Contacto>;
  emitirContacto: EmitirEvento;
  recargarContacto: () => void;
}

export const TabGeneral = ({ contacto }: TabGeneralProps) => {
  const { uiProps } = contacto;

  return (
    <div className="TabGeneral">
      <quimera-formulario>
        <QInput label="Nombre" {...uiProps("nombre")} />
        <QInput label="Email" {...uiProps("email")} />
        <QInput label="NIF" {...uiProps("nif")} />
        <QInput label="Teléfono" {...uiProps("telefono1")} />
      </quimera-formulario>
    </div>
  );
};
