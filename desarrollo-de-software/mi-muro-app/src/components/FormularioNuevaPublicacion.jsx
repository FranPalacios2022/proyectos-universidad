import { useEffect, useState } from 'react';

function FormularioNuevaPublicacion({ onNuevaPublicacion }) {
  const [autor, setAutor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    console.log('Formulario montado');

    return () => {
      console.log('Formulario desmontado');
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!autor.trim() || !titulo.trim() || !contenido.trim()) {
      return;
    }

    onNuevaPublicacion({
      autor: autor.trim(),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
    });

    setAutor('');
    setTitulo('');
    setContenido('');
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>Nueva publicación</h2>

      <div className="campo">
        <label htmlFor="autor">Autor</label>
        <input
          id="autor"
          type="text"
          value={autor}
          onChange={(event) => setAutor(event.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div className="campo">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="¿Qué quieres compartir?"
        />
      </div>

      <div className="campo">
        <label htmlFor="contenido">Contenido</label>
        <textarea
          id="contenido"
          rows="4"
          value={contenido}
          onChange={(event) => setContenido(event.target.value)}
          placeholder="Escribe tu novedad..."
        />
      </div>

      <button type="submit" className="boton-publicar">
        Publicar
      </button>
    </form>
  );
}

export default FormularioNuevaPublicacion;
