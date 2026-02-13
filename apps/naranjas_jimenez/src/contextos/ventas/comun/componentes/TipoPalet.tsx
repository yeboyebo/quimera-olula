import { QAutocompletar } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { getItemsListaTipoPalet } from "../../tipo_palet/infraestructura.ts";

interface VariedadProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const TipoPalet = ({
  descripcion = "",
  valor,
  nombre = "tipo_palet",
  label = "Tipo Palet",
  onChange,
  ...props
}: VariedadProps) => {

    const obtenerOpciones = async (texto: string) => {
        const criteria: Criteria = {
            filtro: [["descripcion", "~", texto]],
            orden: ["id"],
            paginacion: { limite: 10, pagina: 1 },
        };

        const tiposPalet = await getItemsListaTipoPalet(
            criteria.filtro,
            criteria.orden
        );

        return tiposPalet.map((tipoPalet) => ({
            ...tipoPalet,
            valor: tipoPalet.id,
            descripcion: tipoPalet.descripcion,

        }));
    };

    return (
        <QAutocompletar
            label={label}
            nombre={nombre}
            onChange={onChange}
            valor={valor}
            obtenerOpciones={obtenerOpciones}
            descripcion={descripcion}
            {...props}
        />
    );
};
