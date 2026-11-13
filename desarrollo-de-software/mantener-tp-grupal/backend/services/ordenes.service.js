import { Op } from 'sequelize';
import { ESTADOS, PRIORIDADES } from '../models/index.js';
import { camposPermitidos, texto, entero } from '../middlewares/validacion.js';
import { esAdmin, puedeVer } from '../middlewares/auth.js';
import { errorHttp } from '../utils/error.js';
export function crearOrdenesService(db, {
  Orden,
  Activo,
  Usuario,
  HistorialOrden
}) {
  const usuariosAtributos = ['id', 'nombre', 'rol'];
  const include = [{
    model: Activo,
    as: 'activo'
  }, {
    model: Usuario,
    as: 'solicitante',
    attributes: usuariosAtributos
  }, {
    model: Usuario,
    as: 'tecnico',
    attributes: usuariosAtributos
  }];
  // SQLite admite un escritor. Esta cola evita transacciones simultáneas en este proceso.
  let ultimaEscritura = Promise.resolve();
  function escribir(fn) {
    const operacion = ultimaEscritura.then(() => db.transaction(fn));
    ultimaEscritura = operacion.catch(() => {});
    return operacion;
  }
  async function buscar(id, transaction) {
    const orden = await Orden.findByPk(id, {
      transaction
    });
    if (!orden) throw errorHttp(404, 'Orden inexistente');
    return orden;
  }
  function acceso(usuario, orden) {
    if (!puedeVer(usuario, orden)) throw errorHttp(403, 'No tenés permisos para acceder a esta orden');
  }
  async function activoValido(id, transaction) {
    entero(id, 'Activo');
    const activo = await Activo.findByPk(id, {
      transaction
    });
    if (!activo) throw errorHttp(404, 'Activo inexistente');
    if (activo.estado === 'baja') throw errorHttp(400, 'No se puede crear una orden sobre un activo dado de baja');
    return activo;
  }
  function prioridadValida(prioridad, activo) {
    if (!PRIORIDADES.includes(prioridad)) throw errorHttp(400, 'Prioridad inválida');
    if (activo.criticidad === 'alta' && prioridad === 'baja') throw errorHttp(400, 'Un activo de criticidad alta no admite prioridad baja');
  }
  async function tecnicoValido(id, transaction) {
    if (id === null || id === undefined) throw errorHttp(400, 'Técnico requerido');
    entero(id, 'Técnico');
    const tecnico = await Usuario.findByPk(id, {
      transaction
    });
    if (!tecnico || tecnico.rol !== 'tecnico' || !tecnico.activo) throw errorHttp(400, 'El técnico debe existir, estar activo y tener rol técnico');
  }
  async function historial(orden, usuario, accion, antes, despues, transaction) {
    return HistorialOrden.create({
      ordenId: orden.id,
      usuarioId: usuario.id,
      accion,
      valorAnterior: antes,
      valorNuevo: despues
    }, {
      transaction
    });
  }
  async function recalcularActivo(activoId, transaction) {
    const activo = await Activo.findByPk(activoId, {
      transaction
    });
    if (activo.estado === 'baja') return;
    const pendientes = await Orden.findAll({
      where: {
        activoId,
        estado: {
          [Op.in]: ['abierta', 'asignada', 'en_proceso']
        }
      },
      transaction
    });
    const estado = pendientes.some(o => ['asignada', 'en_proceso'].includes(o.estado)) ? 'en_mantenimiento' : pendientes.length ? 'con_falla' : 'operativo';
    await activo.update({
      estado
    }, {
      transaction
    });
  }
  function alcance(usuario) {
    if (esAdmin(usuario)) return {};
    if (usuario.rol === 'tecnico') return {
      tecnicoId: usuario.id
    };
    return {
      solicitanteId: usuario.id
    };
  }
  function queryEntero(valor, defecto, nombre) {
    if (valor === undefined || valor === '') return defecto;
    if (typeof valor !== 'string' || !/^\d+$/.test(valor)) throw errorHttp(400, `${nombre} inválido`);
    return entero(Number(valor), nombre);
  }
  async function listar(usuario, query) {
    const where = alcance(usuario);
    const filtros = {};
    for (const campo of ['estado', 'prioridad']) {
      if (query[campo]) {
        if (!(campo === 'estado' ? ESTADOS : PRIORIDADES).includes(query[campo])) throw errorHttp(400, `${campo} inválido`);
        filtros[campo] = query[campo];
      }
    }
    for (const campo of ['activoId', 'tecnicoId']) if (query[campo]) filtros[campo] = queryEntero(query[campo], null, campo);
    const page = queryEntero(query.page, 1, 'page');
    const limit = queryEntero(query.limit, 10, 'limit');
    if (limit > 100) throw errorHttp(400, 'limit no puede superar 100');
    const sortBy = query.sortBy || 'fechaCreacion';
    const order = query.order || 'DESC';
    if (!['id', 'titulo', 'fechaCreacion', 'estado', 'prioridad'].includes(sortBy) || !['ASC', 'DESC'].includes(order)) throw errorHttp(400, 'Ordenamiento inválido');
    // AND mantiene siempre la restricción de propiedad aunque se envíen otros filtros.
    const {
      count,
      rows
    } = await Orden.findAndCountAll({
      where: {
        [Op.and]: [where, filtros]
      },
      include,
      order: [[sortBy, order], ['id', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
    return {
      items: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }
  async function obtener(usuario, id) {
    const orden = await buscar(id);
    acceso(usuario, orden);
    return Orden.findByPk(id, {
      include
    });
  }
  async function crear(usuario, datos) {
    if (!esAdmin(usuario) && usuario.rol !== 'solicitante') throw errorHttp(403, 'No tenés permisos para crear órdenes');
    camposPermitidos(datos, ['activoId', 'titulo', 'descripcion', 'prioridad', 'tecnicoId']);
    const titulo = texto(datos.titulo, 'Título', 3, 120);
    const descripcion = texto(datos.descripcion, 'Descripción', 10, 2000);
    const id = await escribir(async transaction => {
      const activo = await activoValido(datos.activoId, transaction);
      prioridadValida(datos.prioridad, activo);
      if (datos.tecnicoId != null && !esAdmin(usuario)) throw errorHttp(403, 'Solo administración puede asignar técnicos');
      if (datos.tecnicoId != null) await tecnicoValido(datos.tecnicoId, transaction);
      const orden = await Orden.create({
        activoId: activo.id,
        titulo,
        descripcion,
        prioridad: datos.prioridad,
        solicitanteId: usuario.id,
        tecnicoId: null,
        estado: 'abierta'
      }, {
        transaction
      });
      await historial(orden, usuario, 'creacion', null, {
        titulo,
        descripcion,
        activoId: activo.id,
        prioridad: orden.prioridad,
        estado: 'abierta'
      }, transaction);
      if (datos.tecnicoId != null) {
        await orden.update({
          tecnicoId: datos.tecnicoId,
          estado: 'asignada'
        }, {
          transaction
        });
        await historial(orden, usuario, 'asignacion', {
          tecnicoId: null,
          estado: 'abierta'
        }, {
          tecnicoId: orden.tecnicoId,
          estado: 'asignada'
        }, transaction);
      }
      await recalcularActivo(activo.id, transaction);
      return orden.id;
    });
    return obtener(usuario, id);
  }
  async function modificar(usuario, id, datos) {
    camposPermitidos(datos, ['titulo', 'descripcion', 'prioridad', 'tecnicoId', 'estado']);
    if (!Object.keys(datos).length) throw errorHttp(400, 'No hay cambios para guardar');
    await escribir(async transaction => {
      const orden = await buscar(id, transaction);
      acceso(usuario, orden);
      if (['resuelta', 'cancelada'].includes(orden.estado)) throw errorHttp(400, 'Una orden resuelta o cancelada no admite cambios');
      const admin = esAdmin(usuario);
      const solicitante = usuario.rol === 'solicitante' && orden.solicitanteId === usuario.id;
      const tecnico = usuario.rol === 'tecnico' && orden.tecnicoId === usuario.id;
      const patch = {};
      for (const campo of ['titulo', 'descripcion']) if (datos[campo] !== undefined) {
        if (!admin && !(solicitante && orden.estado === 'abierta')) throw errorHttp(403, 'No tenés permisos para editar los datos de esta orden');
        patch[campo] = texto(datos[campo], campo === 'titulo' ? 'Título' : 'Descripción', campo === 'titulo' ? 3 : 10, campo === 'titulo' ? 120 : 2000);
      }
      if (datos.prioridad !== undefined) {
        if (!admin) throw errorHttp(403, 'Solo administración puede cambiar la prioridad');
        prioridadValida(datos.prioridad, await Activo.findByPk(orden.activoId, {
          transaction
        }));
        patch.prioridad = datos.prioridad;
      }
      if (Object.hasOwn(datos, 'tecnicoId')) {
        if (!admin) throw errorHttp(403, 'Solo administración puede asignar técnicos');
        await tecnicoValido(datos.tecnicoId, transaction);
        if (!['abierta', 'asignada'].includes(orden.estado)) throw errorHttp(400, 'Solo se puede asignar o reasignar antes de iniciar el trabajo');
        patch.tecnicoId = datos.tecnicoId;
        if (orden.estado === 'abierta') patch.estado = 'asignada';
      }
      if (datos.estado !== undefined && datos.estado !== orden.estado) {
        if (!ESTADOS.includes(datos.estado)) throw errorHttp(400, 'Estado inválido');
        const destino = datos.estado;
        if (destino === 'cancelada') {
          if (!admin && !(solicitante && orden.estado === 'abierta')) throw errorHttp(403, 'No tenés permisos para cancelar esta orden');
        } else if (destino === 'asignada') {
          if (!admin) throw errorHttp(403, 'Solo administración puede asignar técnicos');
          if (orden.estado !== 'abierta') throw errorHttp(400, 'Transición de estado no permitida');
          await tecnicoValido(patch.tecnicoId ?? orden.tecnicoId, transaction);
        } else {
          if (!admin && !tecnico) throw errorHttp(403, 'No tenés permisos para cambiar el estado');
          if (destino === 'resuelta' && !(patch.tecnicoId ?? orden.tecnicoId)) throw errorHttp(400, 'Técnico requerido para resolver la orden');
          const siguiente = {
            asignada: 'en_proceso',
            en_proceso: 'resuelta'
          };
          if (siguiente[orden.estado] !== destino) throw errorHttp(400, 'Transición de estado no permitida');
        }
        patch.estado = destino;
        if (destino === 'resuelta') patch.fechaResolucion = new Date();
      } else if (datos.estado !== undefined && !ESTADOS.includes(datos.estado)) throw errorHttp(400, 'Estado inválido');
      const antes = {},
        despues = {};
      for (const [key, value] of Object.entries(patch)) if (value !== orden[key]) {
        antes[key] = orden[key];
        despues[key] = value;
      }
      if (!Object.keys(despues).length) throw errorHttp(400, 'No hay cambios para guardar');
      await orden.update(patch, {
        transaction
      });
      // Un registro por tipo de cambio; edición y prioridad no se pierden si se asigna al mismo tiempo.
      const grupos = [['edicion', ['titulo', 'descripcion']], ['cambio_prioridad', ['prioridad']], ['asignacion', ['tecnicoId']], [patch.estado === 'resuelta' ? 'resolucion' : patch.estado === 'cancelada' ? 'cancelacion' : 'cambio_estado', ['estado', 'fechaResolucion']]];
      for (const [accion, keys] of grupos) {
        const modificados = keys.filter(k => Object.hasOwn(despues, k));
        if (modificados.length) await historial(orden, usuario, accion, Object.fromEntries(modificados.map(k => [k, antes[k]])), Object.fromEntries(modificados.map(k => [k, despues[k]])), transaction);
      }
      await recalcularActivo(orden.activoId, transaction);
    });
    return obtener(usuario, id);
  }
  async function verHistorial(usuario, id) {
    acceso(usuario, await buscar(id));
    return HistorialOrden.findAll({
      where: {
        ordenId: id
      },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: usuariosAtributos
      }],
      order: [['fechaHora', 'ASC'], ['id', 'ASC']]
    });
  }
  async function resumen() {
    const ordenes = await Orden.findAll({
      include: [{
        model: Activo,
        as: 'activo'
      }]
    });
    const porEstado = Object.fromEntries(ESTADOS.map(e => [e, 0]));
    const porActivo = new Map();
    for (const orden of ordenes) {
      porEstado[orden.estado]++;
      const item = porActivo.get(orden.activoId) || {
        id: orden.activoId,
        codigo: orden.activo.codigo,
        nombre: orden.activo.nombre,
        cantidad: 0
      };
      // Fallas = órdenes registradas no canceladas. Se documenta este criterio.
      if (orden.estado !== 'cancelada') item.cantidad++;
      porActivo.set(orden.activoId, item);
    }
    const pendientes = ordenes.filter(o => !['cancelada', 'resuelta'].includes(o.estado));
    return {
      total: ordenes.length,
      porEstado,
      urgentes: pendientes.filter(o => o.prioridad === 'urgente').length,
      sinTecnico: pendientes.filter(o => !o.tecnicoId).length,
      activosConMasFallas: [...porActivo.values()].filter(a => a.cantidad).sort((a, b) => b.cantidad - a.cantidad || a.id - b.id).slice(0, 5)
    };
  }
  return {
    listar,
    obtener,
    crear,
    modificar,
    verHistorial,
    resumen,
    recalcularActivo
  };
}
