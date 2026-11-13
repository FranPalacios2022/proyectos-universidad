import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { asignarOrden, cancelarOrden, editarOrden, resolverOrden } from '../services/ordenes.service';
import { mensajeError } from '../services/api';
import { ErrorVisible } from './Compartidos';
export default function AccionesOrden({
  orden,
  tecnicos,
  onCambio
}) {
  const {
    usuario,
    admin
  } = useAuth();
  const [tecnico, setTecnico] = useState(orden.tecnicoId || ''),
    [error, setError] = useState(''),
    [ocupado, setOcupado] = useState(false),
    [confirmar, setConfirmar] = useState(false);
  const cerrada = ['resuelta', 'cancelada'].includes(orden.estado);
  const propiaAbierta = usuario.rol === 'solicitante' && orden.solicitanteId === usuario.id && orden.estado === 'abierta';
  const puedeAvanzar = admin || usuario.rol === 'tecnico' && orden.tecnicoId === usuario.id;
  async function ejecutar(accion) {
    setError('');
    setOcupado(true);
    try {
      await accion();
      setConfirmar(false);
      await onCambio();
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setOcupado(false);
    }
  }
  if (cerrada) return <section className="panel p-4"><h2>Intervención cerrada</h2><p className="text-secondary mb-0">El historial se conserva. Esta orden ya no admite modificaciones.</p></section>;
  return <section className="panel p-4"><h2>Gestionar intervención</h2><ErrorVisible mensaje={error} /><div className="d-flex flex-wrap gap-2 my-3">
    {(admin || propiaAbierta) && <Link className="btn btn-outline-primary" to={`/ordenes/${orden.id}/editar`}>Editar datos</Link>}
    {puedeAvanzar && orden.estado === 'asignada' && <button disabled={ocupado} className="btn btn-primary" onClick={() => ejecutar(() => editarOrden(orden.id, {
        estado: 'en_proceso'
      }))}>Iniciar trabajo →</button>}
    {puedeAvanzar && orden.estado === 'en_proceso' && <button disabled={ocupado} className="btn btn-primary" onClick={() => ejecutar(() => resolverOrden(orden.id))}>Marcar como resuelta ✓</button>}
    {(admin || propiaAbierta) && <button disabled={ocupado} className="btn btn-outline-danger" onClick={() => setConfirmar(true)}>Cancelar orden</button>}
  </div>{admin && ['abierta', 'asignada'].includes(orden.estado) && <form className="assign-form" onSubmit={e => {
      e.preventDefault();
      ejecutar(() => asignarOrden(orden.id, Number(tecnico)));
    }}><label className="form-label" htmlFor="asignar">{orden.tecnicoId ? 'Reasignar técnico' : 'Asignar técnico'}</label><div className="d-flex gap-2"><select id="asignar" className="form-select" required value={tecnico} onChange={e => setTecnico(e.target.value)}><option value="">Seleccionar técnico</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select><button disabled={ocupado || !tecnico || Number(tecnico) === orden.tecnicoId} className="btn btn-primary">Asignar</button></div></form>}
    {confirmar && <div className="alert alert-warning mt-3" role="alert"><p>¿Confirmás la cancelación? La orden quedará cerrada y no se podrá reabrir.</p><button className="btn btn-danger me-2" disabled={ocupado} onClick={() => ejecutar(() => cancelarOrden(orden.id))}>Sí, cancelar</button><button className="btn btn-outline-secondary" disabled={ocupado} onClick={() => setConfirmar(false)}>Volver</button></div>}
  </section>;
}
