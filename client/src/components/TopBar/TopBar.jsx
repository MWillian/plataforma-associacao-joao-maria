import './TopBar.css'

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="social-links">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Twitter">♥</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="YouTube">▶</a>
        </div>

        <a className="phone" href="tel:+5582998988989">
          <span>☎</span>
          (82) 99898-8989
        </a>
      </div>
    </div>
  )
}

export default TopBar