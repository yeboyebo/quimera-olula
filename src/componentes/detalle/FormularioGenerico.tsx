import { useEffect, useState } from "react";
import { Entidad } from "../../contextos/comun/diseño.ts";
import { renderInput, renderSelect, renderSpace } from "./helpers.tsx";

export type OpcionCampo = [string, string];

export type CampoFormularioGenerico = {
  nombre: string;
  etiqueta: string;
  placeholder?: string;
  tipo: "text" | "email" | "number" | "date" | "password" | "space" | "select";
  soloLectura?: boolean;
  oculto?: boolean;
  requerido?: boolean;
  valorInicial?: string;
  ancho?: string;
  condensado?: boolean;
  opciones?: OpcionCampo[];
  xtipo?: string;
};

type FormularioGenericoProps<T> = {
  campos: CampoFormularioGenerico[];
  entidad: T;
  setEntidad: (entidad: T) => void;
  onSubmit: (data: T) => Promise<void>;
  onCampoCambiado?: (campo: string, valor: any) => void;
  validacion?: (entidad: T) => string | null;
};

export const Input = (
  {
    controlado,
    ...props
  }: {
    controlado: boolean,
    campo: CampoFormularioGenerico,
    onCampoCambiado?: (campo: string, valor: any) => void,
    valorEntidad: any,
    validador?: (valor: string) => boolean,
  }) => {

  return controlado
    ? <InputControlado {...props} />
    : <InputNoControlado {...props} />
  
}

const InputControlado = (
  {
    campo,
    onCampoCambiado,
    valorEntidad,
    validador,
  } : {
    campo: CampoFormularioGenerico,
    onCampoCambiado?: (campo: string, valor: any) => void,
    valorEntidad: any,
    validador?: (valor: string) => boolean,
  }) => {
  
  const [valido, setValido] = useState<boolean>(true);

  const onInput = (valor: string) => {
    onCampoCambiado && onCampoCambiado(campo.nombre, valor);
    setValido(validador ? validador(valor) : true);
  }

  useEffect(() => {
    setValido(validador ? validador(valorEntidad) : true);
  }
  , [valorEntidad]);

  return (
    <label>{campo.etiqueta + " " + (valido ? "OK" : "(Inválido)")} :
    <input
      type="text"
      value={valorEntidad || ""}
      onInput={(e) => onInput((e.target as HTMLInputElement).value)}
    />
    </label>
  );
}

const InputNoControlado = (
  {
    campo,
    onCampoCambiado,
    valorEntidad,
    validador,
  }: {
    campo: CampoFormularioGenerico,
    onCampoCambiado?: (campo: string, valor: any) => void,
    valorEntidad: any,
    validador?: (valor: string) => boolean,
  }) => {
  
  const [valor, setValor] = useState<string | undefined>(undefined);
  const [valido, setValido] = useState<boolean>(true);

  useEffect(() => {
    setValor(valorEntidad || "");
  }
  , [valorEntidad]);


  const onInput = (valor: string) => {
    setValor(valor); 
    setValido(validador ? validador(valor || "") : true);
  }
  const prefijoCambiado = valor !== valorEntidad ? "!" : "";

  return (
    <label>{prefijoCambiado + campo.etiqueta + " " + (valido ? "OK" : "(Inválido)")} :
    <input
      type="text"
      value={valor || ""}
      onBlur={(e) => valido && (valor !== valorEntidad) && onCampoCambiado && onCampoCambiado(campo.nombre, e.target.value)}
      onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      onKeyUp={(e) => e.code === 'Escape' && onInput(valorEntidad || "")}
      // onKeyUp={(e) => e.code === 'Enter' && onCampoCambiado && onCampoCambiado(campo.nombre, e.target.value)}
    />
    </label>
  );
}

export const CampoGenerico = (
  {
    campo,
    onCampoCambiado,
    entidad,
    validador,
  } : {
    campo: CampoFormularioGenerico,
    onCampoCambiado?: (campo: string, valor: any) => void,
    entidad: any,
    validador?: (valor: string) => boolean,
  }
) => {
  
  return (
    <div > 
      {
        campo.tipo === "space"
        ? renderSpace()
        : campo.tipo === "select"
        ? renderSelect(campo, entidad)
        // : renderInput(campo, entidad)
        : campo?.xtipo
          ? <Input
              campo={campo}
              controlado={campo.xtipo === "controlado"}
              onCampoCambiado={onCampoCambiado}
              valorEntidad={entidad[campo.nombre]}
              validador={validador}
            />
            : <>{renderInput(campo, entidad)}</>
      }
      </div>
  );
}

export const FormularioGenerico = <T extends Entidad>({
  campos,
  entidad,
  setEntidad,
  onSubmit,
  onCampoCambiado,
  validacion,
}: FormularioGenericoProps<T>) => {
  const handleAction = (formData: FormData) => {
    const data = Object.fromEntries(formData);

    const nuevaEntidad = { ...entidad, ...data };

    const error = validacion ? validacion(nuevaEntidad) : null;

    if (error) {
      alert(error);
      return;
    }

    onSubmit(nuevaEntidad).then(() => setEntidad(nuevaEntidad));
  };

  if (!entidad) {
    return <>No encontrado</>;
  }

  return (
    <form action={handleAction}>
      {campos
        .filter((campo) => !campo.oculto)
        .map((campo) =>
          <CampoGenerico
            key={campo.nombre}
            campo={campo}
            onCampoCambiado={onCampoCambiado}
            entidad={entidad}
          />
          // Para el fallo de que todos los hijos tienen un key único
          // <div key={campo.nombre}> 
          // {
          //   campo.tipo === "space"
          //   ? renderSpace()
          //   : campo.tipo === "select"
          //   ? renderSelect(campo, entidad)
          //   // : renderInput(campo, entidad)
          //   : campo?.xtipo === "controlado"
          //     ? <>
          //       <label>{campo.etiqueta}:
          //       <input
          //         type="text"
          //         value={entidad[campo.nombre]}
          //         onInput={(e) => onCampoCambiado && onCampoCambiado(campo.nombre, e.target.value)}
          //       />
          //       </label>
          //     </>
          //     : campo?.xtipo === "no controlado"
          //       ? <InputNoControlado
          //         campo={campo}
          //         onCampoCambiado={onCampoCambiado}
          //         valorEntidad={entidad[campo.nombre]}
          //       />
          //       : <>{renderInput(campo, entidad)}</>
          // }
          // </div>
        )}
      <quimera-boton tipo="submit">Enviar</quimera-boton>
    </form>
  );
};

