# Quimera Olula

## Instalación

### Requisitos

- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/es/download)
- [git](https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git)

### Recomendaciones

- [GitHub CLI](https://cli.github.com/)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Instalación

Clonar el repositorio:

```sh
gh repo clone yeboyebo/quimera-olula
# o => git clone https://github.com/yeboyebo/quimera-olula.git
cd quimera-olula

pnpm install
```

## Contribución

- Hacer un fork del repositorio
- Envíar una pull request

## Uso (todo el workspace)

- `pnpm lint`. Lanzar el linter
- `pnpm type-check`. Lanzar el type-checker
- `pnpm run ci`. Lanzar todos los comprobadores de CI
- `pnpm test`. Lanza los tests en modo continuo

> También es posible lanzar estos comandos por aplicación (ver --filter de abajo)

## Uso por aplicación

- `pnpm run --filter @olula/**nombre_app** dev`. Levantar **nombre_app** en desarrollo
- `pnpm run --filter @olula/**nombre_app** build`. Crear un desplegable de **nombre_app**
- `pnpm run --filter @olula/**nombre_app** preview`. Visualizar la última build de **nombre_app**

> Nota: Para cambiar la ruta de la API, crear un fichero `.env` en la raiz de **nombre_app** e informar la propiedad `VITE_API_URL`

## URLs

- `/docs/componentes`. Página de revisión de componentes
