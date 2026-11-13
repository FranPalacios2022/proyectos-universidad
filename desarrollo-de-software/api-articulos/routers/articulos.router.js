import { Router } from 'express';
import articulosService from '../services/articulos.service.js';

const articulosRouter = Router();

articulosRouter.get('/api/articulos', async (req, res) => {
  const { nombre, pagina, limite } = req.query;
  res.json(await articulosService.listar({ nombre, pagina, limite }));
});

// ⚠ Tiene que ir ANTES de /:id; si no, "stock-bajo" se toma como un id
articulosRouter.get('/api/articulos/stock-bajo', async (req, res) => {
  res.json(await articulosService.stockBajo(req.query.minimo));
});

articulosRouter.get('/api/articulos/:id', async (req, res) => {
  res.json(await articulosService.obtenerPorId(Number(req.params.id)));
});

articulosRouter.post('/api/articulos', async (req, res) => {
  res.status(201).json(await articulosService.crear(req.body));
});

articulosRouter.put('/api/articulos/:id', async (req, res) => {
  res.json(await articulosService.actualizar(Number(req.params.id), req.body));
});

articulosRouter.delete('/api/articulos/:id', async (req, res) => {
  await articulosService.eliminar(Number(req.params.id));
  res.sendStatus(204);
});

export default articulosRouter;