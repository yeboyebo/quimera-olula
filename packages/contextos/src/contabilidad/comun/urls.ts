class CONTABILIDAD_Urls {
    readonly ASIENTO = `/contabilidad/asiento`;
    readonly ASIENTO_RENUMERAR = `/contabilidad/asiento/renumerar`;
    readonly PARTIDA = `/contabilidad/asiento/partida`;
    readonly SUBCUENTA = `/contabilidad/subcuenta`;
    readonly CUENTA = `/contabilidad/cuenta`;
    readonly CUENTA_ESPECIAL = `/contabilidad/cuenta_especial`;
    readonly GRUPO_EPIGRAFE = `/contabilidad/grupo_epigrafe`;
    readonly EPIGRAFE = `/contabilidad/epigrafe`;
    readonly INFORME_MAYOR = `/contabilidad/informe/mayor`;
    readonly INFORME_DIARIO = `/contabilidad/informe/diario`;
    readonly INFORME_LIBRO_FACTURAS_EMITIDAS = `/contabilidad/informe/libro_facturas_emitidas`;
    readonly INFORME_LIBRO_FACTURAS_RECIBIDAS = `/contabilidad/informe/libro_facturas_recibidas`;
    readonly INFORME_REPORT = (tipo: string) => `/contabilidad/informe/${tipo}/report`;
    readonly CUENTAS_ANUALES = `/contabilidad/cuentas_anuales`;
    readonly CUENTAS_ANUALES_BALANCE = (id: string) =>
        `/contabilidad/cuentas_anuales/${id}/balance`;
    readonly CUENTAS_ANUALES_REPORT = (id: string) =>
        `/contabilidad/cuentas_anuales/${id}/report`;
    readonly CUENTAS_ANUALES_HOJA = (id: string, formato: string) =>
        `/contabilidad/cuentas_anuales/${id}/hoja?formato=${formato}`;
}

export default CONTABILIDAD_Urls;
