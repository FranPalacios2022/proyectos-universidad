function Publicacion({ id, autor, titulo, contenido, likes, onLike }) {
  return (
    <article className="publicacion">
      <div className="publicacion-header">
        <h3>
          {titulo}
          {likes >= 3 && <span className="destacada">🔥 Destacada</span>}
        </h3>
      </div>

      <p className="autor">Por: {autor}</p>
      <p className="contenido">{contenido}</p>

      <div className="acciones">
        <button type="button" onClick={() => onLike(id)}>
          Me Gusta 👍
        </button>
        <span className="likes-count">
          ({likes} {likes === 1 ? 'like' : 'likes'})
        </span>
      </div>
    </article>
  );
}

export default Publicacion;
