# Quimera

## Primeros pasos

- Instalar pnpm

```
npm install -g pnpm
```

- Instalar dependencias (y borrar anteriores si venimos de npm)

```
rm -rf node_modules
pnpm install
```

## Acciones

- Arrancar aplicación

```
pnpm start __aplicacion__
```

- Generar paquete

```
pnpm build __aplicacion__
```

- Generar paquete (con otro modo que no sea produccion)

```
pnpm build __aplicacion__ __modo__
```

- Crear aplicación

```
pnpm create-app __nombre_aplicacion__
```

- Crear extensión

```
pnpm create-extension __nombre_extension__
```

- Lint

```
pnpm lint __ruta__
```

- Lint + Fix

```
pnpm lint-fix __ruta__
```

- Format Check

```
pnpm format-check __ruta__
```

- Format

```
pnpm format __ruta__
```

- Tests

```
pnpm test __ruta__
```
