import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { crearConexion } from '../config/database.js';
import { definirModelos } from '../models/index.js';
import { cargarSemilla } from '../data/semilla.js';
import { crearApp } from '../app.js';
const secret = 'secreto-exclusivo-de-tests-con-mas-de-32-caracteres';
const db = crearConexion(':memory:');
const models = definirModelos(db);
const app = crearApp({
  db,
  models,
  secret,
  rateLimitEnabled: false
});
function token(id = 1, opciones = {}) {
  return jwt.sign({
    rol: 'admin'
  }, secret, {
    algorithm: 'HS256',
    subject: String(id),
    issuer: 'mantenimiento-api',
    audience: 'mantenimiento-web',
    expiresIn: '1h',
    ...opciones
  });
}
const api = (metodo, url, id = 1) => request(app)[metodo](url).set('Authorization', `Bearer ${token(id)}`);
const nueva = (extra = {}) => ({
  activoId: 1,
  titulo: 'Falla de refrigeración',
  descripcion: 'El equipo funciona pero no enfría correctamente.',
  prioridad: 'media',
  ...extra
});
beforeEach(async () => {
  await db.sync({
    force: true
  });
  await cargarSemilla(db, models);
});
afterAll(async () => {
  await db.close();
});
describe('Autenticación y autorización', () => {
  test('login correcto devuelve JWT verificable y usuario sin hash', async () => {
    const r = await request(app).post('/api/auth/login').send({
      email: 'admin@dds.com',
      password: 'Dds2026!'
    });
    expect(r.status).toBe(200);
    expect(jwt.verify(r.body.token, secret).sub).toBe('1');
    expect(r.body.usuario).toMatchObject({
      rol: 'admin',
      email: 'admin@dds.com'
    });
    expect(r.body.usuario.passwordHash).toBeUndefined();
  });
  test('login inválido devuelve 401 y un error genérico', async () => {
    const r = await request(app).post('/api/auth/login').send({
      email: 'admin@dds.com',
      password: 'incorrecta'
    });
    expect(r.status).toBe(401);
    expect(r.body.error).toBe('Email o contraseña incorrectos');
  });
  test('registro guarda hash bcrypt y fija rol solicitante', async () => {
    const r = await request(app).post('/api/auth/register').send({
      nombre: 'Nueva Persona',
      email: 'NUEVA@dds.com',
      password: 'Segura2026!'
    });
    expect(r.status).toBe(201);
    expect(r.body.usuario).toMatchObject({
      rol: 'solicitante',
      email: 'nueva@dds.com'
    });
    const u = await models.Usuario.findByPk(r.body.usuario.id);
    expect(u.passwordHash).not.toBe('Segura2026!');
    expect(await bcrypt.compare('Segura2026!', u.passwordHash)).toBe(true);
  });
  test('no permite elegir rol admin durante el registro', async () => {
    const r = await request(app).post('/api/auth/register').send({
      nombre: 'Intruso',
      email: 'intruso@dds.com',
      password: 'Segura2026!',
      rol: 'admin'
    });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/Campos no permitidos/);
  });
  test('rechaza email duplicado incluso con distinta capitalización', async () => {
    const r = await request(app).post('/api/auth/register').send({
      nombre: 'Duplicado',
      email: 'ADMIN@dds.com',
      password: 'Segura2026!'
    });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/ya está registrado/);
  });
  test('escritura sin JWT devuelve 401', async () => {
    const r = await request(app).post('/api/ordenes').send(nueva());
    expect(r.status).toBe(401);
    expect(r.body.error).toMatch(/JWT/);
  });
  test.each(['vencido', 'firma', 'issuer', 'audience'])('rechaza token %s', async caso => {
    const t = caso === 'vencido' ? token(1, {
      expiresIn: '-1s'
    }) : caso === 'issuer' ? token(1, {
      issuer: 'otro'
    }) : caso === 'audience' ? token(1, {
      audience: 'otro'
    }) : jwt.sign({
      sub: '1'
    }, 'otro-secreto', {
      expiresIn: '1h'
    });
    const r = await request(app).get('/api/ordenes').set('Authorization', `Bearer ${t}`);
    expect(r.status).toBe(401);
    expect(r.body.error).toMatch(/inválido o vencido/);
  });
  test('usuario bloqueado pierde acceso aunque su JWT no venza', async () => {
    await models.Usuario.update({
      activo: false
    }, {
      where: {
        id: 1
      }
    });
    const r = await api('get', '/api/ordenes');
    expect(r.status).toBe(401);
    expect(r.body.error).toMatch(/bloqueado/);
  });
  test('solicitante no puede asignar, aunque el JWT declare admin', async () => {
    const r = await api('patch', '/api/ordenes/1/asignar', 5).send({
      tecnicoId: 2
    });
    expect(r.status).toBe(403);
    expect(r.body.error).toMatch(/permisos/);
  });
  test('resumen protegido para solicitante', async () => {
    const r = await api('get', '/api/ordenes/resumen', 5);
    expect(r.status).toBe(403);
    expect(r.body.error).toMatch(/permisos/);
  });
});
describe('Consultas, filtros y aislamiento de datos', () => {
  test('semilla y listado paginado', async () => {
    const r = await api('get', '/api/ordenes');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({
      total: 15,
      page: 1,
      limit: 10,
      totalPages: 2
    });
    expect(r.body.items).toHaveLength(10);
    expect(JSON.stringify(r.body)).not.toContain('passwordHash');
  });
  test('combina activo, estado, prioridad y técnico', async () => {
    const r = await api('get', '/api/ordenes?activoId=2&estado=asignada&prioridad=media&tecnicoId=3');
    expect(r.status).toBe(200);
    expect(r.body.total).toBe(1);
    expect(r.body.items[0]).toMatchObject({
      id: 2,
      activoId: 2,
      tecnicoId: 3,
      estado: 'asignada',
      prioridad: 'media'
    });
  });
  test('paginación y ordenamiento se resuelven en backend', async () => {
    const r = await api('get', '/api/ordenes?page=2&limit=5&sortBy=id&order=ASC');
    expect(r.status).toBe(200);
    expect(r.body.items.map(o => o.id)).toEqual([6, 7, 8, 9, 10]);
  });
  test('filtro sin coincidencias devuelve array vacío', async () => {
    const r = await api('get', '/api/ordenes?activoId=8');
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({
      total: 0,
      items: []
    });
  });
  test.each(['page=0', 'limit=101', 'sortBy=passwordHash', 'order=DROP', 'estado=inventado', 'tecnicoId=abc'])('query inválida %s', async query => {
    const r = await api('get', `/api/ordenes?${query}`);
    expect(r.status).toBe(400);
    expect(r.body.error).toEqual(expect.any(String));
  });
  test('solicitante solo ve sus propias órdenes', async () => {
    const r = await api('get', '/api/ordenes?limit=100', 5);
    expect(r.status).toBe(200);
    expect(r.body.total).toBe(8);
    expect(r.body.items.every(o => o.solicitanteId === 5)).toBe(true);
  });
  test('filtro tecnicoId no permite al técnico ver asignaciones ajenas', async () => {
    const r = await api('get', '/api/ordenes?tecnicoId=3', 2);
    expect(r.status).toBe(200);
    expect(r.body.items).toEqual([]);
  });
  test('detalle existente e inexistente', async () => {
    const existe = await api('get', '/api/ordenes/1');
    expect(existe.status).toBe(200);
    expect(existe.body).toMatchObject({
      id: 1,
      activo: {
        codigo: 'AIRE-01'
      }
    });
    const no = await api('get', '/api/ordenes/999');
    expect(no.status).toBe(404);
    expect(no.body.error).toBe('Orden inexistente');
  });
  test('lectura y auditoría ajenas devuelven 403', async () => {
    for (const path of ['/api/ordenes/2', '/api/ordenes/2/historial']) {
      const r = await api('get', path, 5);
      expect(r.status).toBe(403);
      expect(r.body.error).toMatch(/permisos/);
    }
  });
  test('resumen cuenta los estados reales y no incluye canceladas como fallas', async () => {
    const r = await api('get', '/api/ordenes/resumen');
    expect(r.status).toBe(200);
    expect(r.body.porEstado).toEqual({
      abierta: 3,
      asignada: 3,
      en_proceso: 3,
      resuelta: 3,
      cancelada: 3
    });
    expect(r.body.sinTecnico).toBe(3);
    expect(r.body.activosConMasFallas.length).toBeLessThanOrEqual(5);
  });
});
describe('Reglas del dominio y transacciones', () => {
  test('creación válida persiste orden, historial y estado del activo', async () => {
    const activo = await models.Activo.create({
      codigo: 'PRUEBA',
      nombre: 'Activo libre',
      tipo: 'equipo',
      ubicacion: 'Laboratorio',
      criticidad: 'media',
      estado: 'operativo'
    });
    const r = await api('post', '/api/ordenes', 5).send(nueva({
      activoId: activo.id
    }));
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({
      estado: 'abierta',
      solicitanteId: 5,
      tecnicoId: null,
      activo: {
        estado: 'con_falla'
      }
    });
    expect(await models.HistorialOrden.count({
      where: {
        ordenId: r.body.id,
        accion: 'creacion'
      }
    })).toBe(1);
  });
  test.each([[8, 400, /dado de baja/], [999, 404, /inexistente/]])('rechaza activo %i', async (activoId, status, mensaje) => {
    const r = await api('post', '/api/ordenes', 5).send(nueva({
      activoId
    }));
    expect(r.status).toBe(status);
    expect(r.body.error).toMatch(mensaje);
    expect(await models.Orden.count()).toBe(15);
  });
  test('rechaza baja prioridad en activo crítico y no crea historial', async () => {
    const antes = await models.HistorialOrden.count();
    const r = await api('post', '/api/ordenes', 5).send(nueva({
      activoId: 2,
      prioridad: 'baja'
    }));
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/criticidad alta/);
    expect(await models.HistorialOrden.count()).toBe(antes);
  });
  test('rechaza prioridad inválida', async () => {
    const r = await api('post', '/api/ordenes', 5).send(nueva({
      prioridad: 'extrema'
    }));
    expect(r.status).toBe(400);
    expect(r.body.error).toBe('Prioridad inválida');
  });
  test('no permite falsificar solicitante ni estado al crear', async () => {
    const r = await api('post', '/api/ordenes', 5).send(nueva({
      solicitanteId: 1,
      estado: 'resuelta'
    }));
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/no permitidos/);
  });
  test('resolver sin técnico devuelve error específico', async () => {
    const r = await api('patch', '/api/ordenes/1/resolver').send({});
    expect(r.status).toBe(400);
    expect(r.body.error).toBe('Técnico requerido para resolver la orden');
  });
  test('asignar sin técnico devuelve error específico', async () => {
    const r = await api('patch', '/api/ordenes/1/asignar').send({});
    expect(r.status).toBe(400);
    expect(r.body.error).toBe('Técnico requerido');
  });
  test('no permite resolver una orden cancelada', async () => {
    const r = await api('patch', '/api/ordenes/5/resolver').send({});
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/cancelada/);
  });
  test('no permite saltear asignada → resuelta', async () => {
    const r = await api('patch', '/api/ordenes/2/resolver').send({});
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/Transición/);
  });
  test('rechaza estado fuera del enum', async () => {
    const r = await api('put', '/api/ordenes/1').send({
      estado: 'inventado'
    });
    expect(r.status).toBe(400);
    expect(r.body.error).toBe('Estado inválido');
  });
  test('no permite asignar a un solicitante como técnico', async () => {
    const r = await api('patch', '/api/ordenes/1/asignar').send({
      tecnicoId: 5
    });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/rol técnico/);
  });
  test('técnico no puede resolver orden de otro técnico', async () => {
    const r = await api('patch', '/api/ordenes/3/resolver', 2).send({});
    expect(r.status).toBe(403);
    expect(r.body.error).toMatch(/permisos/);
  });
  test('solicitante edita título propio abierto, pero no prioridad', async () => {
    const r = await api('put', '/api/ordenes/1', 5).send({
      titulo: 'Título actualizado'
    });
    expect(r.status).toBe(200);
    expect(r.body.titulo).toBe('Título actualizado');
    const no = await api('put', '/api/ordenes/1', 5).send({
      prioridad: 'alta'
    });
    expect(no.status).toBe(403);
    expect(no.body.error).toMatch(/administración/);
  });
  test('solicitante cancela orden abierta propia, no una asignada', async () => {
    const ok = await api('patch', '/api/ordenes/1/cancelar', 5).send({});
    expect(ok.status).toBe(200);
    expect(ok.body.estado).toBe('cancelada');
    const no = await api('patch', '/api/ordenes/2/cancelar', 6).send({});
    expect(no.status).toBe(403);
    expect(no.body.error).toMatch(/permisos/);
  });
  test('flujo completo abierta → asignada → en_proceso → resuelta', async () => {
    const a = await models.Activo.create({
      codigo: 'FLUJO',
      nombre: 'Activo flujo',
      tipo: 'equipo',
      ubicacion: 'Lab',
      criticidad: 'media',
      estado: 'operativo'
    });
    const alta = await api('post', '/api/ordenes', 5).send(nueva({
      activoId: a.id
    }));
    expect(alta.status).toBe(201);
    expect(alta.body.estado).toBe('abierta');
    const url = `/api/ordenes/${alta.body.id}`;
    const asignada = await api('patch', `${url}/asignar`).send({
      tecnicoId: 2
    });
    expect(asignada.status).toBe(200);
    expect(asignada.body).toMatchObject({
      estado: 'asignada',
      activo: {
        estado: 'en_mantenimiento'
      }
    });
    const proceso = await api('put', url, 2).send({
      estado: 'en_proceso'
    });
    expect(proceso.status).toBe(200);
    expect(proceso.body.estado).toBe('en_proceso');
    const fin = await api('patch', `${url}/resolver`, 2).send({});
    expect(fin.status).toBe(200);
    expect(fin.body).toMatchObject({
      estado: 'resuelta',
      activo: {
        estado: 'operativo'
      }
    });
    expect(fin.body.fechaResolucion).toBeTruthy();
    const h = await api('get', `${url}/historial`, 5);
    expect(h.status).toBe(200);
    expect(h.body.map(x => x.accion)).toEqual(expect.arrayContaining(['creacion', 'asignacion', 'cambio_estado', 'resolucion']));
  });
  test('resolver una orden no oculta otras fallas del mismo activo', async () => {
    const a = await models.Activo.create({
      codigo: 'DOBLE',
      nombre: 'Dos fallas',
      tipo: 'equipo',
      ubicacion: 'Lab',
      criticidad: 'media',
      estado: 'operativo'
    });
    await api('post', '/api/ordenes', 5).send(nueva({
      activoId: a.id
    }));
    const otra = await api('post', '/api/ordenes').send(nueva({
      activoId: a.id,
      tecnicoId: 2
    }));
    expect(otra.status).toBe(201);
    expect(otra.body.estado).toBe('asignada');
    await api('put', `/api/ordenes/${otra.body.id}`, 2).send({
      estado: 'en_proceso'
    });
    const fin = await api('patch', `/api/ordenes/${otra.body.id}/resolver`, 2).send({});
    expect(fin.status).toBe(200);
    expect(fin.body.activo.estado).toBe('con_falla');
  });
  test('si falla escribir auditoría, revierte la orden y el activo', async () => {
    const antes = await models.Orden.count();
    models.HistorialOrden.addHook('beforeCreate', 'falloTest', () => {
      throw new Error('Fallo de almacenamiento simulado');
    });
    try {
      const r = await api('post', '/api/ordenes', 5).send(nueva());
      expect(r.status).toBe(500);
      expect(r.body.error).toBe('Error interno del servidor');
      expect(await models.Orden.count()).toBe(antes);
    } finally {
      models.HistorialOrden.removeHook('beforeCreate', 'falloTest');
    }
  });
  test('semilla es idempotente y no borra operaciones existentes', async () => {
    expect(await cargarSemilla(db, models)).toBe(false);
    expect(await models.Orden.count()).toBe(15);
    expect(await models.Activo.count()).toBe(8);
  });
  test('JSON mal formado devuelve 400 sin detalles internos', async () => {
    const r = await api('post', '/api/ordenes').set('Content-Type', 'application/json').send('{bad');
    expect(r.status).toBe(400);
    expect(r.body.error).toBe('El cuerpo no es JSON válido');
  });
});
