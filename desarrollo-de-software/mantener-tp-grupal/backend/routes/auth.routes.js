import { Router } from 'express';
import { asyncHandler } from '../utils/error.js';
import { validarBody } from '../middlewares/validacion.js';
import { usuarioPublico } from '../services/auth.service.js';
export function crearAuthRouter(service, autenticar, limiter) {
  const router = Router();
  router.post('/register', limiter, validarBody, asyncHandler(async (req, res) => res.status(201).json(await service.registrar(req.body))));
  router.post('/login', limiter, validarBody, asyncHandler(async (req, res) => res.json(await service.login(req.body))));
  router.get('/me', autenticar, (req, res) => res.json(usuarioPublico(req.usuario)));
  return router;
}
