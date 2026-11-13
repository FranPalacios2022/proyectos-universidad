import { useEffect, useState } from 'react';
import './App.css';
import FormularioNuevaPublicacion from './components/FormularioNuevaPublicacion';
import Publicacion from './components/Publicacion';
import ResumenMuro from './components/ResumenMuro';

const datosSimuladosApi = [
  {
    id: 1,
    autor: 'Ana Coder',
    titulo: 'Mi primer día con React',
    contenido: '¡Hoy empecé a aprender React y estoy emocionada! Los componentes son geniales.',
    likes: 0,
  },
  {
    id: 2,
    autor: 'Luis Dev',
    titulo: 'useEffect al rescate',
    contenido: 'Descubriendo cómo useEffect puede manejar efectos secundarios. Muy potente.',
    likes: 0,
  },
  {
    id: 3,
    autor: 'Carla Sys',
    titulo: 'Estado y Props',
    contenido: 'Entender la diferencia y el flujo de datos en React es clave.',
    likes: 0,
  },
];

function App() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [proximoId, setProximoId] = useState(4);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [mostrarSoloDestacadas, setMostrarSoloDestacadas] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPublicaciones(datosSimuladosApi);
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleNuevaPublicacion = (nuevaPublicacionData) => {
    const nuevaPublicacionConId = { ...nuevaPublicacionData, id: proximoId, likes: 0 };

    setPublicaciones((prevPublicaciones) => [nuevaPublicacionConId, ...prevPublicaciones]);
    setProximoId((prevId) => prevId + 1);
  };

  const handleLike = (id) => {
    setPublicaciones((prevPublicaciones) =>
      prevPublicaciones.map((pub) =>
        pub.id === id ? { ...pub, likes: pub.likes + 1 } : pub,
      ),
    );
  };

  const totalLikes = publicaciones.reduce((sum, pub) => sum + pub.likes, 0);

  useEffect(() => {
    document.title = `Muro (${totalLikes} 👍)`;
  }, [totalLikes]);

  const publicacionesVisibles = mostrarSoloDestacadas
    ? publicaciones.filter((pub) => pub.likes >= 3)
    : publicaciones;

  let contenidoPublicaciones;

  if (isLoading) {
    contenidoPublicaciones = <p className="empty-state">Cargando publicaciones...</p>;
  } else if (publicacionesVisibles.length === 0) {
    contenidoPublicaciones = (
      <p className="empty-state">
        {mostrarSoloDestacadas
          ? 'No hay publicaciones destacadas por ahora.'
          : 'No hay publicaciones aún. ¡Sé el primero en agregar una!'}
      </p>
    );
  } else {
    contenidoPublicaciones = publicacionesVisibles.map((pub) => (
      <Publicacion
        key={pub.id}
        id={pub.id}
        autor={pub.autor}
        titulo={pub.titulo}
        contenido={pub.contenido}
        likes={pub.likes}
        onLike={handleLike}
      />
    ));
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <span className="badge">Semana 11</span>
        <h1>Muro de Novedades</h1>
        <p>Un espacio para compartir avances, ideas y descubrimientos.</p>
      </header>

      <main className="content">
        <ResumenMuro cantidadPublicaciones={publicaciones.length} totalLikes={totalLikes} />

        <div className="toolbar">
          <button
            type="button"
            className="toggle-button"
            onClick={() => setMostrarFormulario((prev) => !prev)}
          >
            {mostrarFormulario ? 'Ocultar formulario' : '✍️ Nueva publicación'}
          </button>

          <button
            type="button"
            className="toggle-button secondary"
            onClick={() => setMostrarSoloDestacadas((prev) => !prev)}
          >
            {mostrarSoloDestacadas ? 'Ver todas' : 'Ver solo destacadas'}
          </button>
        </div>

        {mostrarFormulario && (
          <FormularioNuevaPublicacion onNuevaPublicacion={handleNuevaPublicacion} />
        )}

        <section className="seccion-publicaciones">
          <h2>Publicaciones recientes</h2>
          {contenidoPublicaciones}
        </section>
      </main>
    </div>
  );
}

export default App;
