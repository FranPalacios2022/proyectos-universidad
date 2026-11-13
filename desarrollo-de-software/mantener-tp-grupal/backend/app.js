import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { crearAuthService } from './services/auth.service.js';
import { crearOrdenesService } from './services/ordenes.service.js';
import { crearOrdenesController } from './controllers/ordenes.controller.js';
import { crearOrdenesRouter } from './routes/ordenes.routes.js';
import { crearAuthRouter } from './routes/auth.routes.js';
import { autenticar } from './middlewares/auth.js';
import { manejarErrores } from './middlewares/errores.js';
import { asyncHandler } from './utils/error.js';

// Separar app de listen permite probarla con Supertest sin abrir un puerto.
export function crearApp({
  db,
  models,
  secret,
  expiresIn = '2h',
  rateLimitEnabled = true
}) {
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  }));
  app.use(express.json({
    limit: '16kb'
  }));
  const auth = autenticar(models.Usuario, secret);
  const limiter = rateLimitEnabled ? rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      error: 'Demasiados intentos. Probá nuevamente más tarde'
    }
  }) : (req, res, next) => next();
  const service = crearOrdenesService(db, models);
  app.get('/api/health', (req, res) => res.json({
    estado: 'ok'
  }));
  app.use('/api/auth', crearAuthRouter(crearAuthService(models.Usuario, secret, expiresIn), auth, limiter));
  app.get('/api/activos', auth, asyncHandler(async (req, res) => {
    const activos = await models.Activo.findAll({
      order: [['nombre', 'ASC']]
    });
    res.json(activos.map(a => ({
      ...a.toJSON(),
      prioridadSugerida: a.criticidad === 'alta' ? 'alta' : 'media'
    })));
  }));
  app.get('/api/tecnicos', auth, asyncHandler(async (req, res) => res.json(await models.Usuario.findAll({
    where: {
      rol: 'tecnico',
      activo: true
    },
    attributes: ['id', 'nombre'],
    order: [['nombre', 'ASC']]
  }))));
  app.use('/api/ordenes', auth, crearOrdenesRouter(crearOrdenesController(service)));
  app.use((req, res) => res.status(404).json({
    error: 'Ruta inexistente'
  }));
  app.use(manejarErrores);
  return app;
}
