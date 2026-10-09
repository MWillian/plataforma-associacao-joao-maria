import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">

        <a href="/" className="logo">
          <img
            src="/logo.png"
            alt="Associação Comunitária João Maria"
          />
        </a>

        <div className="nav-links">
          <a href="#quem-somos">QUEM SOMOS</a>
          <a href="#estudio-adagio">ESTÚDIO ADÁGIO</a>
          <a href="#artesanato">ARTESANATO</a>
          <a href="#agricultura">AGRICULTURA FAMILIAR</a>

          <a href="#doar" className="donate-button">
            COMO DOAR?
          </a>
        </div>

      </div>
    </nav>
  )
}

export default Navbar