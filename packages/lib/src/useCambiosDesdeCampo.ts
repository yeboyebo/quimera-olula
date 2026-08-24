import { useCallback, useContext } from "react";
import { ContextoError } from "./contexto.ts";

/**
 * Hook genérico: detecta cambios en campos concretos y llama a una función
 * asíncrona que devuelve campos recalculados por el servidor.
 *
 * Patrón de uso:
 *   1. Declara `camposDisparadores` en dominio.ts (qué campos activan la llamada).
 *   2. Proporciona un adapter `getCambios` en dominio.ts que convierte entre el
 *      modelo de UI y el tipo que acepta la función de infraestructura.
 *   3. Construye el `contexto` con `useMemo` en el componente.
 *
 * @typeParam T  Tipo del modelo de formulario.
 * @typeParam C  Tipo del contexto adicional que necesita cada módulo
 *               (ej: { pedidoId: string } o la cabecera completa del pedido).
 *
 * @param camposDisparadores  Campos que activan la llamada al servidor.
 * @param getCambios          Adapter: recibe (modelo, campo, contexto) y devuelve
 *                            los campos a sobrescribir en el modelo (Partial<T>).
 * @param contexto            Datos de contexto del módulo (memoizar con useMemo).
 */
export function useCambiosDesdeCampo<T extends object, C>(
    camposDisparadores: readonly (keyof T & string)[],
    getCambios: (modelo: T, campo: string, contexto: C) => Promise<Partial<T>>,
    contexto: C
) {
    const { intentar } = useContext(ContextoError);

    /**
     * Llamar tras `set(nuevaLinea)` optimista.
     *
     * Detecta si algún campo disparador cambió en `delta` y, en ese caso,
     * llama a getCambios y hace `set` con el resultado del servidor.
     *
     * @param modelo  Modelo ya actualizado con el delta (actualización optimista).
     * @param delta   Campos que cambiaron en esta interacción (Partial<T> o compatible).
     * @param set     Setter del hook de modelo para aplicar la respuesta del servidor.
     */
    const aplicarCambiosServidor = useCallback(
        async (modelo: T, delta: Partial<T>, set: (m: T) => void) => {
            const campoDisparador = camposDisparadores.find(c => c in delta);
            if (!campoDisparador) return;

            await intentar(async () => {
                const cambiosServidor = await getCambios(modelo, campoDisparador, contexto);
                set({ ...modelo, ...cambiosServidor });
            });
        },
        [camposDisparadores, getCambios, intentar, contexto]
    );

    return { aplicarCambiosServidor };
}
