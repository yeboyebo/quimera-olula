# Uso Slot

## Descripción

Slot es un componente que permite generar "ranuras" dentro de otros componentes. Por ejemplo, podemos renderizar un formulario maestro, pero dejar una ranura para rellenar los elementos de la lista desde fuera.

## Propiedades

```ts
type SlotProps = {
  nombre?: string;
  requerido?: boolean;
  hijos: ReactNode;
  children: ReactNode;
}
```

- **nombre**: propiedad opcional que permite identificar una ranura. En caso de no informar la propiedad, se considerará que es el Slot por defecto.
- **requerido**: propiedad opcional que indica si el Slot es requerido. Si lo es y no se provee, lanzará un error.
- **hijos**: propiedad por la que los Slots reciben los hijos de quien les renderiza, para comprobar si existen o no referencias a estas ranuras
- **children**: el propio contenido del Slot. Se renderizará en caso de que no proveeamos el Slot correspondiente.

## Creación de Slots

Se pueden crear ranuras combinando sus propiedades:

- Según el nombre:
    - Slot por defecto:
        ```tsx
        <Slot {...slots} />
        ```
    - Slot nombrado:
        ```tsx
        <Slot nombre="mi-slot" {...slots} />
        ```
- Según si es requerido o no:
    - Slot no requerido:
        ```tsx
        <Slot {...slots} />
        ```
    - Slot requerido:
        ```tsx
        <Slot required {...slots} />
        ```
- Según si tiene valor por defecto o no:
    - Slot sin valor por defecto:
        ```tsx
        <Slot {...slots} />
        ```
    - Slot con valor por defecto:
        ```tsx
        <Slot {...slots}>
            <h1>Valor por defecto</h1>
        </Slot>
        ```
Combinándolas se pueden explorar todas las posibilidades.

## Uso de Slots

Dentro de un componente que haya creado slots, se pueden pasar hijos con la propiedad `slot` (o no, para utilizar el slot por defecto)

- Slot por defecto:
    ```tsx
    <ComponenteConSlots>
        <div>
            <p>Este contenido reemplazará al Slot sin nombre</p>
        </div>
    </ComponenteConSlots>
    ```
- Slot nombrado:
    ```tsx
    <ComponenteConSlots>
        <div slot="mi-slot">
            <p>Este contenido reemplazará al Slot con nombre `mi-slot`</p>
        </div>
    </ComponenteConSlots>
    ```

## Ejemplos completos


Componente que crea ranuras:

```tsx
import { PropsWithChildren } from "react";
import { Slot } from "../../componentes/slot/Slot.tsx";

export function ComponenteConSlots({ children }: PropsWithChildren) {
  const slots = { hijos: children };

  return (
    <div>
      <Slot nombre="cabecera" requerido {...slots} />

      <div>
        Aquí hay contenido
      </div>

      <Slot requerido {...slots} />

      <Slot nombre="contenido-secundario" {...slots} />

      <Slot nombre="pie" {...slots}>
        <h1>Pie por defecto</h1>
      </Slot>
    </div>
  );
}
```

Componente que usa ranuras:

```tsx
export function UsoSlots() {
  return (
    <ComponenteConSlots>
        <h1 slot="cabecera">Cabecera</h1>
        <div>
            Contenido principal
        </div>
        <h1 slot="pie">Pie</h1>
    </ComponenteConSlots>
  );
}
```

    Resultado:
        - Cabecera
        - Aquí hay contenido
        - Contenido principal
        - Pie

Ejemplo sin pie:

```tsx
export function UsoSlots() {
  return (
    <ComponenteConSlots>
        <h1 slot="cabecera">Cabecera</h1>
        <div>
            Contenido principal
        </div>
    </ComponenteConSlots>
  );
}
```

    Resultado:
        - Cabecera
        - Aquí hay contenido
        - Contenido principal
        - Pie por defecto

Ejemplo con secundario:

```tsx
export function UsoSlots() {
  return (
    <ComponenteConSlots>
        <h1 slot="cabecera">Cabecera</h1>
        <div>
            Contenido principal
        </div>
        <div slot="contenido-secundario">
            Contenido secundario
        </div>
    </ComponenteConSlots>
  );
}
```

    Resultado:
        - Cabecera
        - Aquí hay contenido
        - Contenido principal
        - Contenido secundario
        - Pie por defecto

Ejemplo sin cabecera:

```tsx
export function UsoSlots() {
  return (
    <ComponenteConSlots>
        <div>
            Contenido principal
        </div>
    </ComponenteConSlots>
  );
}
```

    Resultado:
        - Error