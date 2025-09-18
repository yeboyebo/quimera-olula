import { FactoryVentasOlula } from '../../contextos/ventas/factory.ts';
import { otrosMenu } from './tmp_menu.ts';

export class FactoryOlula {
    Inicio = { menu: { nombre: "Inicio", url: "/", icono: "inicio" } };
    Ventas = FactoryVentasOlula;
    Otros = { menu: otrosMenu };
}

export default FactoryOlula;