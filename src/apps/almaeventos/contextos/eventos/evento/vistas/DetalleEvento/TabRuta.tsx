import { QCheckbox } from "../../../../../../../componentes/atomos/qcheckbox.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { QTextArea } from "../../../../../../../componentes/atomos/qtextarea.tsx";
import { HookModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Evento } from "../../diseño.ts";
import "./TabRuta.css";

interface TabRutaProps {
  evento: HookModelo<Evento>;
  recargarEvento: () => void;
}

export const TabRuta = ({ evento }: TabRutaProps) => {
  const { uiProps } = evento;

  return (
    <div className="TabRuta">
      <quimera-formulario>
        <div className="columna-unica">
          <div className="fila-titulo">
            <h3>Responsables</h3>
          </div>
          
          <div className="fila-2">
            <QInput label="Organizador del evento" {...uiProps("organizador_evento")} />
            <QInput label="Teléfono" {...uiProps("telefono")} />
          </div>
          
          <div className="fila-3">
            <QInput label="Responsable local" {...uiProps("responsable_local")} />
            <QInput label="Responsable orquesta" {...uiProps("responsable_orquesta")} />
            <QInput label="Responsable producciones" {...uiProps("responsable_producciones")} />
          </div>
          
          <div className="fila-titulo">
            <h3>Extras</h3>
          </div>
          
          <div className="fila-5">
            <QInput label="Nº descansos" {...uiProps("num_descansos")} />
            <QInput label="Conexión eléctrica" {...uiProps("conexion_electrica")} />
          </div>
          
          <div className="fila-checkbox">
            <QCheckbox 
              label="Camión en escenario" 
              nombre="camion_escenario" 
              valor={evento.modelo.camion_escenario} 
              onChange={uiProps("camion_escenario").onChange} 
            />
          </div>
          
          <div className="fila-checkbox">
            <QCheckbox 
              label="Camerinos" 
              nombre="camerinos" 
              valor={evento.modelo.camerinos} 
              onChange={uiProps("camerinos").onChange} 
            />
          </div>
          
          <div className="fila-textarea">
            <QTextArea label="Tipo de escenario" {...uiProps("tipo_escenario")} />
          </div>
        </div>
      </quimera-formulario>
    </div>
  );
};