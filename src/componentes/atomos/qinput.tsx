import "./_forminput.css";
import { FormInputProps } from "./_forminput.tsx";

type QInputProps = FormInputProps & {
  lista?: string;
  autocompletar?: "off" | "on";
  onInput?: (valor: string, evento: React.FormEvent<HTMLInputElement>) => void;
};

export const QInput = ({
  label,
  nombre,
  deshabilitado,
  placeholder,
  valor = "",
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  lista,
  autocompletar,
  onChange,
  onBlur,
  onInput,
}: QInputProps) => {
  const attrs = {
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
  };

  return (
    <quimera-input {...attrs}>
      <label>
        <span className="etiqueta">
          {label}
          <span className="etiqueta-opcional">(opcional)</span>
        </span>
        <input
          type="text"
          name={nombre}
          placeholder={placeholder}
          value={onChange ? valor : undefined}
          defaultValue={onChange ? undefined : valor}
          disabled={deshabilitado}
          required={!opcional}
          list={lista}
          autoComplete={autocompletar}
          onChange={(e) => onChange?.(e.target.value, e)}
          onBlur={(e) => onBlur?.(e.target.value, e)}
          onInput={(e) => onInput?.((e.target as HTMLInputElement).value, e)}
        />
        <span className="texto-validacion">{textoValidacion}</span>
      </label>
    </quimera-input>
  );
};
