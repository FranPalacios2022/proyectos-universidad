import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearOrden, editarOrden, obtenerOrden } from '../services/ordenes.service';
import { listarActivos, listarTecnicos } from '../services/catalogos.service';
import { mensajeError } from '../services/api';
import { Cargando, ErrorVisible } from '../components/Compartidos';
import OrdenForm from '../components/OrdenForm';
import { useAuth } from '../context/AuthContext';
export default function OrdenFormPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    admin,
    usuario
  } = useAuth();
  const [datos, setDatos] = useState(null),
    [error, setError] = useState(''),
    [errorGuardar, setErrorGuardar] = useState('');
  useEffect(() => {
    let vigente = true;
    setDatos(null);
    setError('');
    Promise.all([listarActivos(), listarTecnicos(), id ? obtenerOrden(id) : Promise.resolve(null)]).then(([activos, tecnicos, orden]) => {
      if (vigente) setDatos({
        activos,
        tecnicos,
        orden
      });
    }).catch(e => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [id]);
  async function guardar(body) {
    setErrorGuardar('');
    try {
      const orden = id ? await editarOrden(id, body) : await crearOrden(body);
      navigate(`/ordenes/${orden.id}`, {
        state: {
          mensaje: id ? 'Cambios guardados correctamente.' : 'Orden creada correctamente.'
        }
      });
    } catch (e) {
      setErrorGuardar(mensajeError(e));
    }
  }
  const permitida = !datos?.orden ? admin || usuario.rol === 'solicitante' : !['resuelta', 'cancelada'].includes(datos.orden.estado) && (admin || datos.orden.estado === 'abierta' && datos.orden.solicitanteId === usuario.id && usuario.rol === 'solicitante');
  return <><div className="page-heading"><div><p className="eyebrow">REGISTRO DE INTERVENCIÓN</p><h1>{id ? `Editar orden #${id}` : 'Nueva orden'}</h1><p>Una descripción clara es el primer paso para resolver.</p></div></div><ErrorVisible mensaje={error || errorGuardar} />{!datos && !error && <Cargando />}{datos && (permitida ? <OrdenForm key={id || 'nueva'} {...datos} admin={admin} onSubmit={guardar} /> : <ErrorVisible mensaje="No tenés permisos para editar esta orden o ya está cerrada." />)}</>;
}
