import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";

type TipoOrdenProps = Omit<QAutocompletarProps, "obtenerOpciones" | "label"> & { label?: string };

const TIPOS_ORDEN = [
    { valor: "entrada", descripcion: "Entrada" },
    { valor: "salida", descripcion: "Salida" },
    { valor: "traspaso", descripcion: "Traspaso" },
];

export const TipoOrden = ({
    valor,
    nombre = "tipoOrden",
    label = "Tipo de orden",
    onChange,
    ...props
}: TipoOrdenProps) => {
    return (
        <QSelect
            label={label}
            nombre={nombre}
            valor={valor}
            onChange={onChange}
            opciones={TIPOS_ORDEN}
            {...props}
        />
    );
};
