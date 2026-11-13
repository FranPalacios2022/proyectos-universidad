# mi-muro-app

Aplicación React para un muro de novedades interactivo, siguiendo el ejercicio de la Semana 11.

## Qué incluye

- listado de publicaciones con autor, título y contenido
- contador de likes por publicación
- formulario para crear nuevas publicaciones
- estado de carga simulado con `useEffect`
- resumen del total de publicaciones y likes
- filtro para ver solo publicaciones destacadas
- actualización del título de la pestaña con el total de likes

## Requisitos

- Node.js 18+
- npm

## Ejecutar en local

```bash
npm install
npm run dev
```

Luego abrir la URL que indique Vite (por lo general `http://localhost:5173`).

## Build de producción

```bash
npm run build
```

## Estructura principal

- `src/App.jsx`: lógica principal del muro
- `src/components/Publicacion.jsx`: card de cada publicación
- `src/components/FormularioNuevaPublicacion.jsx`: formulario de carga
- `src/components/ResumenMuro.jsx`: resumen de métricas
- `src/App.css`: estilos visuales del proyecto
