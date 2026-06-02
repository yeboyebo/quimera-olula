import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryRrhhOlula } from '#/rrhh_area_empleado/factory.ts';

export class FactoryAreaEmpleados {
    Auth = FactoryAuthOlula;
    Rrhh = FactoryRrhhOlula;
}
