import { DefinicionWidget } from "@olula/lib/widgets.ts";
import { WidgetPrevisionOportunidades } from "./oportunidadventa/widgets/WidgetPrevisionOportunidades.tsx";

export const widgetsCrm: DefinicionWidget[] = [
    {
        id: "crm.widget.prevision_oportunidades",
        regla: "crm.oportunidad_venta.leer",
        Componente: WidgetPrevisionOportunidades,
    },
];