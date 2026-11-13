import express from 'express';
import articulosRouter from './routers/articulos.router.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString('es-AR')}  ${req.method} ${req.url}`);
  next();
});

app.use(articulosRouter);

app.use((req, res) => {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError')
    return res.status(400).json({ mensaje: err.errors.map((e) => e.message).join(', ') });
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ mensaje: 'El cuerpo no es un JSON válido' });

  const status = err.status ?? 500;
  if (status === 500) console.error(err);
  res.status(status).json({ mensaje: status === 500 ? 'Error interno del servidor' : err.message });
});

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));