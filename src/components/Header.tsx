import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' is-active' : ''}`

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">Ailleurs</span>
      </Link>
      <nav className="site-nav">
        <NavLink to="/" className={navClass} end>Destinations</NavLink>
        <NavLink to="/experiences" className={navClass}>Expériences</NavLink>
        <NavLink to="/evenements" className={navClass}>Événements</NavLink>
        <button type="button" className="nav-cta">Se connecter</button>
      </nav>
    </header>
  )
}
