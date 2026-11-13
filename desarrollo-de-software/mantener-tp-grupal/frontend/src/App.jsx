import { Navigate, Outlet, Route, Routes, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Cargando } from './components/Compartidos';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import OrdenesPage from './pages/OrdenesPage';
import OrdenFormPage from './pages/OrdenFormPage';
import DetallePage from './pages/DetallePage';
import ResumenPage from './pages/ResumenPage';
import ActivosPage from './pages/ActivosPage';
function Protegida({
  roles
}) {
  const {
    usuario,
    cargando
  } = useAuth();
  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <div className="container py-5"><h1>Acceso no permitido</h1><p>Tu rol no tiene permisos para esta pantalla.</p><Link to="/ordenes">Volver a mis órdenes</Link></div>;
  return <Outlet />;
}
export default function App() {
  const {
    cargando
  } = useAuth();
  if (cargando) return <Cargando />;
  return <Routes>
    <Route path="/login" element={<AuthPage key="login" />} /><Route path="/registro" element={<AuthPage key="registro" registro />} />
    <Route element={<Protegida />}><Route element={<Layout />}>
      <Route index element={<Navigate to="/ordenes" replace />} /><Route path="ordenes" element={<OrdenesPage />} />
      <Route element={<Protegida roles={['solicitante', 'admin', 'mantenimiento']} />}><Route path="ordenes/nueva" element={<OrdenFormPage />} /><Route path="ordenes/:id/editar" element={<OrdenFormPage />} /></Route>
      <Route path="ordenes/:id" element={<DetallePage />} /><Route path="activos" element={<ActivosPage />} />
      <Route element={<Protegida roles={['admin', 'mantenimiento']} />}><Route path="resumen" element={<ResumenPage />} /></Route>
    </Route></Route>
    <Route path="*" element={<main className="not-found"><p className="eyebrow">ERROR 404</p><h1>Esta página no existe.</h1><p>Podés volver al registro de intervenciones.</p><Link className="btn btn-primary" to="/ordenes">Volver al inicio</Link></main>} />
  </Routes>;
}
