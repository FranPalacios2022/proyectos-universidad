function ResumenMuro({ cantidadPublicaciones, totalLikes }) {
  return (
    <div className="resumen-muro">
      <div className="resumen-item">
        <span className="resumen-label">Publicaciones</span>
        <strong>{cantidadPublicaciones}</strong>
      </div>
      <div className="resumen-item">
        <span className="resumen-label">Likes totales</span>
        <strong>{totalLikes}</strong>
      </div>
    </div>
  );
}

export default ResumenMuro;
