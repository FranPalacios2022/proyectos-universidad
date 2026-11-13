import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { etiqueta } from './Compartidos';
export default function Layout() {
  const {
    usuario,
    salir,
    admin
  } = useAuth();
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/ordenes"><span className="brand-icon">M</span><span>Mantener<small>CONTROL DE MANTENIMIENTO</small></span></Link>
      <div className="nav-label">ESPACIO DE TRABAJO</div>
      <nav aria-label="Navegación principal">
        <NavLink to="/ordenes" end>Órdenes <span>↗</span></NavLink>
        {(admin || usuario.rol === 'solicitante') && <NavLink to="/ordenes/nueva">Nueva orden <span>＋</span></NavLink>}
        <NavLink to="/activos">Activos <span>▦</span></NavLink>
        {admin && <NavLink to="/resumen">Resumen <span>◷</span></NavLink>}
      </nav>
      <div className="sidebar-bottom"><div className="session-name">{usuario.nombre}</div><div className="session-role">{etiqueta(usuario.rol)}</div><button className="logout" onClick={salir}>Cerrar sesión ↗</button></div>
    </aside>
    <div className="main-shell"><header className="topbar"><span>Operaciones / Mantenimiento</span><span className="site-pill"><i /> DDS · 3K6</span></header><main className="workspace"><Outlet /></main><footer>Desarrollo de Software · Trabajo práctico previo al segundo parcial</footer></div>
  </div>;
}
