import { useEffect, useState } from "react";
// import { Contexto } from "../../../comun/contexto.ts";
import {
    CampoGenerico,
} from "../../../../componentes/detalle/FormularioGenerico";
import {
    camposCliente
} from "../infraestructura.ts";

interface IdFiscalProps {
  cliente: Cliente;
  onIdFiscalCambiadoCallback: (idFiscal: IdFiscal) => void;
}

interface IdFiscal {
  id_fiscal: string;
  tipo_id_fiscal: string;
}

interface Cliente {
    id_fiscal: string;
    tipo_id_fiscal: string;
  }

export const IdFiscal = ({
    cliente,
    onIdFiscalCambiadoCallback,
  }: IdFiscalProps) => {

    const [idFiscal, setIdFiscal] = useState<IdFiscal>({
        id_fiscal: cliente.id_fiscal,
        tipo_id_fiscal: cliente.tipo_id_fiscal,
      });

    const [modo, setModo] = useState("mostrar");

    useEffect(() => {
        if (!cliente) {
          return;
        }
        setIdFiscal({
          id_fiscal: cliente.id_fiscal,
          tipo_id_fiscal: cliente.tipo_id_fiscal,
        });
      }, [cliente]);

    const onIdFiscalCambiado = (campo: string, valor: any) => {
        const idFiscalNuevo = {
          ...idFiscal,
          [campo]: valor,
        };
        
        console.log("campo cambiado", campo, 'valor = ', valor);
        setIdFiscal(idFiscalNuevo);
      }

    const idFiscalValido = (tipo: string) => (valor: string) => {
        if (tipo === "NIF") {
            return valor.length === 9;
        }
        if (tipo === "NAF") {
            return valor.length === 11 && valor[0] === "E" && valor[1] === "S";
        }
        return false;
    }
    const tipoIdFiscalValido = (tipo: string) => {
        return tipo === "NIF" || tipo === "NAF";
    }

    const idFiscalValidoGeneral = (tipo: string, valor: string) => {
        return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo);
    }

    const guardarIdFiscal = async() => {
        if (!cliente) {
          return;
        }
        await simularApi();
        onIdFiscalCambiadoCallback(idFiscal)
      }
    
    const simularApi = async () => {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        console.log("Simulando API");
        await delay(500);
        console.log("Simulando API terminado");
    }
    

    const campoIdFiscal = camposCliente.find((c) => c.nombre === "id_fiscal");
    const campoTipoIdFiscal = camposCliente.find((c) => c.nombre === "tipo_id_fiscal");

    return (
        <>
    <CampoGenerico
        key={campoTipoIdFiscal.nombre}
        campo={campoTipoIdFiscal}
        onCampoCambiado={onIdFiscalCambiado}
        entidad={{
          tipo_id_fiscal: idFiscal.tipo_id_fiscal
        }}
        validador={tipoIdFiscalValido}
      />
      <CampoGenerico
        key={campoIdFiscal.nombre}
        campo={campoIdFiscal}
        onCampoCambiado={onIdFiscalCambiado}
        entidad={{
          id_fiscal: idFiscal.id_fiscal
        }}
        validador={idFiscalValido(idFiscal.tipo_id_fiscal)}
      />
      {/* { console.log(idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)) } */}
      <button
        disabled={!idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)}
        onClick={guardarIdFiscal}
      >
        Guardar Id Fiscal
      </button>
      </>
    );
    };


const IdFiscalEdicion = ({
        cliente,
        onIdFiscalCambiadoCallback,
      }: IdFiscalProps) => {
    
        const [idFiscal, setIdFiscal] = useState<IdFiscal>({
            id_fiscal: cliente.id_fiscal,
            tipo_id_fiscal: cliente.tipo_id_fiscal,
          });
    
        const [modo, setModo] = useState("mostrar");
    
        useEffect(() => {
            if (!cliente) {
              return;
            }
            setIdFiscal({
              id_fiscal: cliente.id_fiscal,
              tipo_id_fiscal: cliente.tipo_id_fiscal,
            });
          }, [cliente]);
    
        const onIdFiscalCambiado = (campo: string, valor: any) => {
            const idFiscalNuevo = {
              ...idFiscal,
              [campo]: valor,
            };
            
            console.log("campo cambiado", campo, 'valor = ', valor);
            setIdFiscal(idFiscalNuevo);
          }
    
        const idFiscalValido = (tipo: string) => (valor: string) => {
            if (tipo === "NIF") {
                return valor.length === 9;
            }
            if (tipo === "NAF") {
                return valor.length === 11 && valor[0] === "E" && valor[1] === "S";
            }
            return false;
        }
        const tipoIdFiscalValido = (tipo: string) => {
            return tipo === "NIF" || tipo === "NAF";
        }
    
        const idFiscalValidoGeneral = (tipo: string, valor: string) => {
            return idFiscalValido(tipo)(valor) && tipoIdFiscalValido(tipo);
        }
    
        const guardarIdFiscal = async() => {
            if (!cliente) {
              return;
            }
            await simularApi();
            onIdFiscalCambiadoCallback(idFiscal)
          }
        
        const simularApi = async () => {
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            console.log("Simulando API");
            await delay(500);
            console.log("Simulando API terminado");
        }
        
    
        const campoIdFiscal = camposCliente.find((c) => c.nombre === "id_fiscal");
        const campoTipoIdFiscal = camposCliente.find((c) => c.nombre === "tipo_id_fiscal");
    
        return (
            <>
        <CampoGenerico
            key={campoTipoIdFiscal.nombre}
            campo={campoTipoIdFiscal}
            onCampoCambiado={onIdFiscalCambiado}
            entidad={{
              tipo_id_fiscal: idFiscal.tipo_id_fiscal
            }}
            validador={tipoIdFiscalValido}
          />
          <CampoGenerico
            key={campoIdFiscal.nombre}
            campo={campoIdFiscal}
            onCampoCambiado={onIdFiscalCambiado}
            entidad={{
              id_fiscal: idFiscal.id_fiscal
            }}
            validador={idFiscalValido(idFiscal.tipo_id_fiscal)}
          />
          {/* { console.log(idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)) } */}
          <button
            disabled={!idFiscalValidoGeneral(idFiscal.tipo_id_fiscal, idFiscal.id_fiscal)}
            onClick={guardarIdFiscal}
          >
            Guardar Id Fiscal
          </button>
          </>
        );
        };