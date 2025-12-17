# 🎮 GameCollab

GameCollab es una plataforma para conectar desarrolladores de videojuegos, permitiendo a los usuarios encontrar equipos para sus proyectos o unirse a iniciativas existentes. La aplicación facilita la colaboración entre programadores, artistas, diseñadores y otros profesionales del desarrollo de videojuegos.

## 🚀 Características

- 📝 Publica y busca proyectos de desarrollo de videojuegos
- 👥 Conecta con otros desarrolladores
- 🔍 Filtra proyectos por tecnologías, roles buscados y más
- ✨ Interfaz moderna y responsiva
- 🔒 Autenticación segura con Supabase

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estilización**: Tailwind CSS + shadcn/ui
- **Enrutamiento**: React Router v6
- **Gestión de estado**: React Query
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Bundler**: Vite

## 📦 Dependencias principales

- `@supabase/supabase-js`: Cliente para la integración con Supabase
- `@tanstack/react-query`: Para gestión de estado y caché
- `react-router-dom`: Enrutamiento de la aplicación
- `react-hook-form` + `zod`: Manejo y validación de formularios
- `lucide-react`: Biblioteca de iconos
- `tailwindcss` + `tailwindcss-animate`: Estilización y animaciones

## 🚀 Cómo empezar

### Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior) o yarn
- Una cuenta de [Supabase](https://supabase.com/)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/axel-molina/game-dev-hub.git
   cd game-dev-hub
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 🏗️ Estructura del proyecto

```
src/
├── assets/           # Recursos estáticos (imágenes, fuentes, etc.)
├── components/       # Componentes reutilizables
├── hooks/            # Custom hooks
├── lib/              # Utilidades y configuraciones
├── pages/            # Componentes de página
└── styles/           # Estilos globales
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) para más información.

## 📬 Contacto

Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue o ponerte en contacto con el equipo de desarrollo.