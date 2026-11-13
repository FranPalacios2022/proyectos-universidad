import bcrypt from 'bcryptjs';
import { crearOrdenesService } from '../services/ordenes.service.js';
export async function cargarSemilla(db, models) {
  if (await models.Usuario.count()) return false;
  const passwordHash = await bcrypt.hash('Dds2026!', 10);
  const usuarios = await models.Usuario.bulkCreate([{
    nombre: 'Administración DDS',
    email: 'admin@dds.com',
    rol: 'admin'
  }, {
    nombre: 'Técnica Ana',
    email: 'ana@dds.com',
    rol: 'tecnico'
  }, {
    nombre: 'Técnico Bruno',
    email: 'bruno@dds.com',
    rol: 'tecnico'
  }, {
    nombre: 'Técnica Carla',
    email: 'carla@dds.com',
    rol: 'tecnico'
  }, {
    nombre: 'Solicitante Lucía',
    email: 'solicitante@dds.com',
    rol: 'solicitante'
  }, {
    nombre: 'Solicitante Diego',
    email: 'diego@dds.com',
    rol: 'solicitante'
  }].map(u => ({
    ...u,
    passwordHash,
    activo: true
  })));
  await models.Activo.bulkCreate([{
    codigo: 'AIRE-01',
    nombre: 'Aire acondicionado aula 3',
    tipo: 'equipo',
    ubicacion: 'Possetto · Aula 3',
    criticidad: 'media'
  }, {
    codigo: 'RED-01',
    nombre: 'Switch de laboratorio',
    tipo: 'equipo',
    ubicacion: 'Laboratorio 2',
    criticidad: 'alta'
  }, {
    codigo: 'PROY-01',
    nombre: 'Proyector aula 5',
    tipo: 'equipo',
    ubicacion: 'Aula 5',
    criticidad: 'media'
  }, {
    codigo: 'LUZ-01',
    nombre: 'Iluminación del pasillo',
    tipo: 'instalación',
    ubicacion: 'Planta baja',
    criticidad: 'alta'
  }, {
    codigo: 'MESA-01',
    nombre: 'Mesa de trabajo',
    tipo: 'mobiliario',
    ubicacion: 'Taller',
    criticidad: 'baja'
  }, {
    codigo: 'SOFT-01',
    nombre: 'Sistema de acceso',
    tipo: 'software',
    ubicacion: 'Recepción',
    criticidad: 'alta'
  }, {
    codigo: 'BOMBA-01',
    nombre: 'Bomba de agua',
    tipo: 'equipo',
    ubicacion: 'Sala de máquinas',
    criticidad: 'alta'
  }, {
    codigo: 'PC-BAJA',
    nombre: 'Computadora retirada',
    tipo: 'equipo',
    ubicacion: 'Depósito',
    criticidad: 'baja',
    estado: 'baja'
  }].map(a => ({
    estado: 'operativo',
    ...a
  })));
  const service = crearOrdenesService(db, models);
  const titulos = ['Pérdida de rendimiento', 'Revisión de conexión', 'Ruido intermitente', 'Inspección preventiva', 'Falla al iniciar'];
  for (let i = 0; i < 15; i++) {
    const solicitante = usuarios[i % 2 ? 5 : 4];
    const orden = await service.crear(solicitante, {
      activoId: i % 7 + 1,
      titulo: `${titulos[i % 5]} · caso ${i + 1}`,
      descripcion: 'Se solicita revisar el funcionamiento y registrar la intervención realizada.',
      prioridad: i % 4 === 0 ? 'urgente' : i % 3 === 0 ? 'alta' : 'media'
    });
    const estado = i % 5;
    if (estado >= 1 && estado <= 3) await service.modificar(usuarios[0], orden.id, {
      tecnicoId: usuarios[1 + i % 3].id
    });
    if (estado >= 2 && estado <= 3) await service.modificar(usuarios[0], orden.id, {
      estado: 'en_proceso'
    });
    if (estado === 3) await service.modificar(usuarios[0], orden.id, {
      estado: 'resuelta'
    });
    if (estado === 4) await service.modificar(usuarios[0], orden.id, {
      estado: 'cancelada'
    });
  }
  return true;
}
