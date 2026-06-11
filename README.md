# BlenderPortfolio

Portafolio interactivo 3D construido con Three.js y un modelo creado en Blender. El usuario controla un personaje que camina por un mundo isométrico y puede explorar los proyectos haciendo clic en las pantallas del escenario.

## Características

- Mundo 3D isométrico exportado desde Blender (.glb)
- Personaje controlable con **WASD** o teclas de flecha
- Animación de salto al moverse
- Flores que rebotan al acercarse el personaje
- Colisión con árboles y objetos del escenario
- Cámara que sigue al personaje
- Modales con información detallada de cada proyecto al hacer clic
- Controles táctiles (D-pad) para dispositivos móviles
- Pantalla de carga animada

## Proyectos incluidos

| Proyecto | Tecnologías |
|---|---|
| Sistema de Ubers — SADVU | Angular, CoreUI, Chart.js, Baserow |
| Prevengo | React, Laravel 12, PHP 8.2, MySQL |
| Biblioteca Virtual | Blazor WebAssembly, .NET 8, SQL Server, Docker |
| Kitlo | React, TypeScript, Tailwind, ECharts, Laravel 12 |
| Plataforma de Gestión de Incidencias | React, TypeScript, Laravel 12, MySQL, Docker |

## Tecnologías

- [Three.js](https://threejs.org/) v0.149.0 — renderizado 3D WebGL
- [GSAP](https://gsap.com/) v3.15 — animaciones
- [Blender](https://www.blender.org/) — modelado 3D y exportación GLB
- Git LFS — almacenamiento del archivo GLB

## Correr localmente

Clona el repositorio y sirve los archivos con cualquier servidor estático:

```bash
git clone https://github.com/Betsy0505/BlenderPortfolio.git
cd BlenderPortfolio
npx serve .
```

Abre `http://localhost:3000` en tu navegador.

> El archivo `.glb` usa Git LFS. Asegúrate de tener [Git LFS instalado](https://git-lfs.com/) antes de clonar.
