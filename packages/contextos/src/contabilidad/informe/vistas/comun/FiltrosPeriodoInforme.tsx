import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import "#/comun/estilos/pagina_proceso.css";

export interface FiltrosPeriodoInformeProps {
    ejercicioId: string;
    fechaDesde: string;
    fechaHasta: string;
    onEjercicioId: (v: string) => void;
    onFechaDesde: (v: string) => void;
    onFechaHasta: (v: string) => void;
}

export const FiltrosPeriodoInforme = ({
    ejercicioId,
    fechaDesde,
    fechaHasta,
    onEjercicioId,
    onFechaDesde,
    onFechaHasta,
}: FiltrosPeriodoInformeProps) => (
    <quimera-formulario className="filtros-informe-contable">
        <QInput label="Ejercicio" nombre="ejercicio_id" valor={ejercicioId} onChange={onEjercicioId} />
        <QInput
            label="Fecha desde"
            nombre="fecha_desde"
            tipo="fecha"
            valor={fechaDesde}
            onChange={onFechaDesde}
            opcional
        />
        <QInput
            label="Fecha hasta"
            nombre="fecha_hasta"
            tipo="fecha"
            valor={fechaHasta}
            onChange={onFechaHasta}
            opcional
        />
    </quimera-formulario>
);
