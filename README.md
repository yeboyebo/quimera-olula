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

> Nota: Para cambiar la ruta de la API, crear un fichero `.env` e informar la propiedad `VITE_API_URL`

## Contribución

- Hacer un fork del repositorio
- Envíar una pull request

## Uso

- `pnpm dev`. Levantar la aplicación en desarrollo
- `pnpm lint`. Lanzar el linter
- `pnpm type-check`. Lanzar el type-checker
- `pnpm run ci`. Lanzar todos los comprobadores de CI
- `pnpm test`. Lanza los tests en modo continuo
- `pnpm build`. Crear un desplegable

## URLs

- `/docs/componentes`. Página de revisión de componentes
