import TopBar from '../../components/TopBar/TopBar'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'

import './Home.css'

function Home() {
  return (
    <div className="home">

      <TopBar />

      <Navbar />

      <main>
        <Hero />

        <section id="quem-somos" className="placeholder-section">
          <h2>Quem somos</h2>
        </section>

      </main>

    </div>
  )
}

export default Home