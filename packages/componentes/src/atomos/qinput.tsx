import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
} from "./_forminput.tsx";

export type QInputProps = FormInputProps & {
  modificado?: boolean;
  soloTexto?: boolean;
};

const formatearFechaHora = (valor?: string) => {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const QInput = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  tipo,
  modificado,
  soloTexto,
  valor,
  ...props
}: QInputProps) => {
  if (soloTexto) {
    const valorMostrado =
      tipo === "fecha_hora" ? formatearFechaHora(valor) : valor || "—";
    return (
      <quimera-input solo-texto="" nombre={nombre} tipo={tipo} condensado={condensado}>
        <label>
          <Etiqueta label={label} />
          <span className="valor-solo-texto">{valorMostrado}</span>
        </label>
      </quimera-input>
    );
  }

  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
    modificado,
    tipo,
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    tipo,
    valor,
    ...props,
  };

  return (
    <quimera-input {...attrs}>
      <label>
        <Etiqueta label={label} />
        <FormInput {...inputAttrs} />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-input>
  );
};
