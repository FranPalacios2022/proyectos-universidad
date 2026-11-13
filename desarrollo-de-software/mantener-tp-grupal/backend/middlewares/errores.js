export function manejarErrores(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({
    error: 'El cuerpo no es JSON válido'
  });
  if (err.name === 'SequelizeUniqueConstraintError') return res.status(400).json({
    error: 'El email o código ya está registrado'
  });
  if (err.name === 'SequelizeValidationError') return res.status(400).json({
    error: 'Los datos no cumplen las validaciones'
  });
  const status = err.status || 500;
  if (status === 500) console.error('Error interno:', err.name); // Sin cuerpos, contraseñas ni tokens.
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : err.message
  });
}
