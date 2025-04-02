import "./qinput.css";

export type FormInputProps = {
  label: string;
  nombre: string;
  deshabilitado?: boolean;
  placeholder?: string;
  valor?: string;
  textoValidacion?: string;
  erroneo?: boolean;
  advertido?: boolean;
  valido?: boolean;
  opcional?: boolean;
  condensado?: boolean;
  onChange?: (valor: string, evento?: React.ChangeEvent<HTMLElement>) => void;
  onBlur?: (valor: string, evento?: React.ChangeEvent<HTMLElement>) => void;
};

type QInputProps = FormInputProps & {};

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
  onChange,
  onBlur,
}: QInputProps) => {
  const attrs = { erroneo, advertido, valido, opcional, condensado };

  return (
    <quimera-input {...attrs}>
      <label>
        <span className="etiqueta">
          {label}&nbsp;
          <span className="etiqueta-opcional">(opcional)</span>
        </span>
        <input
          type="text"
          name={nombre}
          placeholder={placeholder}
          value={onChange ? valor : undefined}
          defaultValue={onChange ? undefined : valor}
          disabled={deshabilitado}
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          onBlur={onBlur ? (e) => onBlur(e.target.value, e) : undefined}
        />
        <span className="texto-validacion">{textoValidacion}</span>
      </label>
    </quimera-input>
  );
};
