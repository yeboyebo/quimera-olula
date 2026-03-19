import "./_forminput.css";
import { QDate, QDateProps } from "./qdate.tsx";

type QDateIntervalProps = QDateProps;

export const QDateInterval = ({
  label,
  nombre,
  valor,
  onChange,
  ...props
}: QDateIntervalProps) => {
  const [desde, hasta] = valor as unknown as [string, string];

  const manejarChange = (v: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const clave = e.target.name.split("__")[1];

    const nuevoValor = [
      clave === "desde" ? v : desde,
      clave === "hasta" ? v : hasta,
    ] as [string, string];

    onChange?.(nuevoValor as unknown as string, e);
  };

  return (
    <>
      <QDate
        {...props}
        label={label + " desde"}
        nombre={nombre + "__desde"}
        valor={desde}
        onChange={manejarChange}
      />
      <QDate
        {...props}
        label={label + " hasta"}
        nombre={nombre + "__hasta"}
        valor={hasta}
        onChange={manejarChange}
      />
    </>
  );
};
