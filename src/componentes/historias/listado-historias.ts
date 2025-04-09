import * as HistoriasBoton from "../atomos/qboton.historias.ts";
import * as HistoriasCheckbox from "../atomos/qcheckbox.historias.ts";
import * as HistoriasDate from "../atomos/qdate.historias.ts";
import * as HistoriasInput from "../atomos/qinput.historias.ts";
import * as HistoriasSelect from "../atomos/qselect.historias.ts";
import { HistoriasComponente } from "./diseño.ts";

export const listadoHistorias = [
    HistoriasBoton,
    HistoriasInput,
    HistoriasSelect,
    HistoriasDate,
    HistoriasCheckbox,
] as unknown as HistoriasComponente[];
