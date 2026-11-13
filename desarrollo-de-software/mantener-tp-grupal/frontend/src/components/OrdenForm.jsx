import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { prioridades } from './Compartidos';
export default function OrdenForm({
  orden,
  activos,
  tecnicos,
  admin,
  onSubmit
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
      isDirty
    }
  } = useForm({
    defaultValues: {
      activoId: orden?.activoId || '',
      titulo: orden?.titulo || '',
      descripcion: orden?.descripcion || '',
      prioridad: orden?.prioridad || 'media',
      tecnicoId: orden?.tecnicoId || ''
    }
  });
  const activoId = watch('activoId');
  const activo = activos.find(a => a.id === Number(activoId));
  const activoField = register('activoId', {
    required: 'Seleccioná un activo',
    validate: v => activos.find(a => a.id === Number(v))?.estado !== 'baja' || 'El activo está dado de baja'
  });
  const tecnicoEditable = admin && (!orden || ['abierta', 'asignada'].includes(orden.estado));
  return <form className="panel form-panel" onSubmit={handleSubmit(async data => {
    const body = {
      titulo: data.titulo.trim(),
      descripcion: data.descripcion.trim()
    };
    if (!orden) {
      body.activoId = Number(data.activoId);
      body.prioridad = data.prioridad;
      if (admin && data.tecnicoId) body.tecnicoId = Number(data.tecnicoId);
    } else {
      if (admin && data.prioridad !== orden.prioridad) body.prioridad = data.prioridad;
      if (tecnicoEditable && data.tecnicoId && Number(data.tecnicoId) !== orden.tecnicoId) body.tecnicoId = Number(data.tecnicoId);
    }
    await onSubmit(body);
  })} noValidate><h2>{orden ? 'Datos de la intervención' : '¿Qué necesita atención?'}</h2><p className="text-secondary">Los campos marcados con * son obligatorios.</p><div className="row g-4 mt-1">
    <div className="col-md-8"><label className="form-label" htmlFor="activo">Activo afectado *</label><select id="activo" className="form-select" disabled={!!orden} {...activoField} onChange={e => {
          activoField.onChange(e);
          const a = activos.find(a => a.id === Number(e.target.value));
          if (a) setValue('prioridad', a.prioridadSugerida, {
            shouldDirty: true
          });
        }}><option value="">Seleccionar activo</option>{activos.map(a => <option key={a.id} value={a.id} disabled={a.estado === 'baja'}>{a.codigo} · {a.nombre}{a.estado === 'baja' ? ' (dado de baja)' : ''}</option>)}</select><div className="field-error">{errors.activoId?.message}</div></div>
    <div className="col-md-4"><label className="form-label" htmlFor="prioridad">Prioridad *</label><select id="prioridad" className="form-select" disabled={!!orden && !admin} {...register('prioridad', {
          required: 'Seleccioná una prioridad',
          validate: v => !(activo?.criticidad === 'alta' && v === 'baja') || 'Un activo crítico no admite prioridad baja'
        })}>{prioridades.map(p => <option key={p} value={p} disabled={p === 'baja' && activo?.criticidad === 'alta'}>{p}</option>)}</select><div className="field-error">{errors.prioridad?.message}</div></div>
    {activo && <div className="col-12"><div className="asset-hint"><strong>{activo.ubicacion}</strong><span>Criticidad {activo.criticidad} · prioridad sugerida: {activo.prioridadSugerida}</span></div></div>}
    <div className="col-12"><label className="form-label" htmlFor="titulo">Título *</label><input id="titulo" className="form-control" placeholder="Ej.: El equipo no enciende" {...register('titulo', {
          required: 'Ingresá un título',
          validate: v => v.trim().length >= 3 || 'Mínimo 3 caracteres',
          maxLength: {
            value: 120,
            message: 'Máximo 120 caracteres'
          }
        })} /><div className="field-error">{errors.titulo?.message}</div></div>
    <div className="col-12"><label className="form-label" htmlFor="descripcion">Descripción *</label><textarea id="descripcion" className="form-control" rows="5" placeholder="Contá qué ocurre, desde cuándo y cualquier dato útil para la intervención." {...register('descripcion', {
          required: 'Describí el problema',
          validate: v => v.trim().length >= 10 || 'Mínimo 10 caracteres',
          maxLength: {
            value: 2000,
            message: 'Máximo 2000 caracteres'
          }
        })} /><div className="field-error">{errors.descripcion?.message}</div></div>
    {tecnicoEditable && <div className="col-md-6"><label className="form-label" htmlFor="tecnico">Técnico</label><select id="tecnico" className="form-select" {...register('tecnicoId')}><option value="" disabled={!!orden?.tecnicoId}>Sin asignar</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select><div className="form-text">Asignar un técnico cambia una orden abierta a asignada.</div></div>}
  </div><div className="form-actions"><Link className="btn btn-outline-secondary" to={orden ? `/ordenes/${orden.id}` : '/ordenes'}>Volver</Link><button className="btn btn-primary" disabled={isSubmitting || !!orden && !isDirty}>{isSubmitting ? 'Guardando…' : orden ? 'Guardar cambios' : 'Crear orden →'}</button></div></form>;
}
