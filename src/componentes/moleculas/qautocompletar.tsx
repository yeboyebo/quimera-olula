import { useRef } from "react";
import { FormInputProps, QInput } from "../atomos/qinput.tsx";

type QAutocompletarProps = FormInputProps & {
  opciones: { valor: string; descripcion: string }[];
};

export const QAutocompletar = ({
  nombre,
  valor,
  opciones,
  onBlur,
  onChange,
  ...props
}: QAutocompletarProps) => {
  const valorReal = useRef<HTMLInputElement>(null);

  const renderOpciones = opciones.map((opcion) => (
    <option key={opcion.valor} value={opcion.valor}>
      {opcion.descripcion}
    </option>
  ));

  const listaId = nombre + "-datalist";

  const input = (valor: string, e: React.FormEvent<HTMLInputElement>) => {
    const opcion = opciones.find((opcion) => opcion.valor === valor);
    if (!opcion) {
      valorReal.current!.value = "";
      return;
    }

    const objetivo = e.target as HTMLInputElement;
    objetivo.value = opcion.descripcion;

    valorReal.current!.value = opcion.valor;
  };

  const blur = (valor: string, e: React.FocusEvent<HTMLElement>) => {
    const opcion = opciones.find((opcion) => opcion.descripcion === valor);
    if (opcion) return;

    const objetivo = e.target as HTMLInputElement;
    objetivo.value = "";

    valorReal.current!.value = "";
  };

  return (
    <quimera-autocompletar>
      <datalist id={listaId}>{renderOpciones}</datalist>
      <input
        ref={valorReal}
        type="hidden"
        name={nombre}
        value={valor}
        defaultValue={undefined}
        onChange={(e) => onChange?.(e.target.value, e)}
        onBlur={(e) => onBlur?.(e.target.value, e)}
      />
      <QInput
        {...props}
        nombre=""
        lista={listaId}
        autocompletar="off"
        onInput={input}
        onBlur={blur}
      />
    </quimera-autocompletar>
  );
};
