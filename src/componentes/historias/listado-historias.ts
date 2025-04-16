import * as HistoriasBoton from "../atomos/qboton.historias.ts";
import * as HistoriasCheckbox from "../atomos/qcheckbox.historias.ts";
import * as HistoriasDate from "../atomos/qdate.historias.ts";
import * as HistoriasInput from "../atomos/qinput.historias.ts";
import * as HistoriasSelect from "../atomos/qselect.historias.ts";
import * as HistoriasModal from "../moleculas/qmodal.historias.ts";
import { HistoriasComponente } from "./diseño.ts";

export const listadoHistorias = [
    HistoriasBoton,
    HistoriasInput,
    HistoriasSelect,
    HistoriasDate,
    HistoriasCheckbox,
    HistoriasModal,
] as unknown as HistoriasComponente[];
