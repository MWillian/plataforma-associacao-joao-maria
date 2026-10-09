import heroImg from '../../assets/hero.png'
import './Hero.css'

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-content">

        <div className="hero-text">
          <h1>
            ASSOCIAÇÃO
            <br />
            JOÃO MARIA
          </h1>

          <p>
            Unindo pessoas,
            <br />
            transformando vidas
            <br />
            e fortalecendo nossa
            <br />
            comunidade.
          </p>
        </div>

        <div className="hero-image-wrapper">
          <img
            src={heroImg}
            alt="Atividades realizadas pela Associação João Maria"
          />

        </div>

      </div>

    </section>
  )
}

export default Hero