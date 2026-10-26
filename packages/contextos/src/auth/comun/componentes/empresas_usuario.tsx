import { QMultiCheckbox } from "@olula/componentes/atomos/qmulticheckbox.tsx";
import { useEffect, useState } from "react";
import { getEmpresasBasicas } from "../../../empresa/empresa/infraestructura.ts";

interface EmpresasUsuarioProps {
  valor?: unknown;
  nombre?: string;
  onChange?: (v: unknown, e?: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmpresasUsuario = ({
  nombre = "empresas",
  valor,
  onChange,
}: EmpresasUsuarioProps) => {
  const [opciones, setOpciones] = useState<{ valor: string; descripcion: string }[]>([]);

  useEffect(() => {
    getEmpresasBasicas().then((empresas) =>
      setOpciones(empresas.map((e) => ({ valor: e.id, descripcion: e.nombre })))
    );
  }, []);

  return (
    <QMultiCheckbox
      label="Empresas"
      nombre={nombre}
      valor={valor as string}
      opciones={opciones}
      onChange={onChange as (v: string, e: React.ChangeEvent<HTMLInputElement>) => void}
    />
  );
};
