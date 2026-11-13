import { Router } from 'express';
import { asyncHandler } from '../utils/error.js';
import { autorizarRoles } from '../middlewares/auth.js';
import { validarBody, validarId, camposPermitidos } from '../middlewares/validacion.js';
export function crearOrdenesRouter(controller) {
  const router = Router();
  const admin = autorizarRoles('admin', 'mantenimiento');
  router.get('/', asyncHandler(controller.listar));
  // Antes de /:id para que Express no interprete "resumen" como identificador.
  router.get('/resumen', admin, asyncHandler(controller.resumen));
  router.get('/:id', validarId, asyncHandler(controller.obtener));
  router.get('/:id/historial', validarId, asyncHandler(controller.historial));
  router.post('/', autorizarRoles('solicitante', 'admin', 'mantenimiento'), validarBody, asyncHandler(controller.crear));
  router.put('/:id', validarId, validarBody, asyncHandler(controller.modificar));
  router.patch('/:id/cancelar', validarId, asyncHandler(controller.cancelar));
  router.patch('/:id/asignar', admin, validarId, validarBody, (req, res, next) => {
    camposPermitidos(req.body, ['tecnicoId']);
    next();
  }, asyncHandler(controller.asignar));
  router.patch('/:id/resolver', autorizarRoles('tecnico', 'admin', 'mantenimiento'), validarId, asyncHandler(controller.resolver));
  return router;
}
