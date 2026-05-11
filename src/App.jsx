import LeadForm from './components/LeadForm'

export default function App() {
  return (
    <>
      <main className="hero">
        <section className="hero-copy">
          <div className="logo">Bloom Realty Group</div>
          <h1>Unlock <span className="pink">Builder&nbsp;Incentives</span> Near&nbsp;You</h1>
          <p className="sub">See new homes, current incentives, and estimated payments that fit your budget.</p>
          <p className="small">
            Thinking about leaving your apartment? You may be closer to buying new than you think.
            I&rsquo;ll help you compare homes, builder incentives, and buyer benefits without the pressure.
          </p>
          <div className="trust">
            <div>I represent you, not the builder</div>
            <div>Tour on your own schedule</div>
            <div>Protect your buyer benefits</div>
          </div>
        </section>

        <section className="card">
          <LeadForm />
        </section>
      </main>

      <section className="bonus-section">
        <div className="bonus-inner">
          <div className="bonus-card">
            <h3>The Bloom Builder Bonus Program</h3>
            <p><strong>$2,500 to $6,000 in buyer benefits</strong> on top of builder incentives when available.</p>
            <ul>
              <li>Closing costs</li>
              <li>Lowering your monthly payment</li>
              <li>Lease buyout options</li>
              <li>Debt payoff strategies for eligible VA buyers</li>
            </ul>
          </div>

          <div className="why-card">
            <h3>Text me first before you tour</h3>
            <p>
              Protect your buyer benefits, even if you visit the builder on your own.
              Many builders require buyers to be registered correctly from the start.
            </p>
            <ul>
              <li>No pressure</li>
              <li>No confusing builder process</li>
              <li>Local guidance before you walk in</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer">
        <strong>Bobby Herrera</strong><br />
        Your Bloom Builder Bonus Specialist | Real Estate Advisor<br />
        (210) 616-1029 | bobbyherrera@kw.com | www.bobbtherealtor.com<br />
        Brokered by Keller Williams Heritage
      </footer>
    </>
  )
}
