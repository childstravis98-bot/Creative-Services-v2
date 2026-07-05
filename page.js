import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="wrap">
        <nav className="nav">
          <Link href="/" className="brand">Beach House<span>CREATIVES</span></Link>
          <div className="navlinks">
            <Link className="pill" href="/studio">Studio</Link>
            <Link className="pill" href="/pricing">Pricing</Link>
            <Link className="pill" href="/shops">Paint Shops</Link>
            <Link className="pill" href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="eyebrow">AI-powered e-bike paint designs</div>
          <h1>Your bike. Your style. Endless possibilities.</h1>
          <p className="lead">
            Upload your e-bike, describe the vibe, generate custom paint concepts, buy your favorite design, and send it directly to a nearby paint shop.
          </p>
          <div className="actions">
            <Link className="button primary" href="/studio">Upload Your Bike</Link>
            <Link className="button secondary" href="/shops">Join Paint Shop Network</Link>
          </div>
        </section>

        <section className="section grid">
          <div className="card">
            <h3>10 designs at once</h3>
            <p>Generate a full set of concepts from one prompt: beach cruiser, racing gloss, matte stealth, candy flake, chrome, retro surf, or anything else.</p>
          </div>
          <div className="card">
            <h3>Watermarked previews</h3>
            <p>Customers can preview concepts for free. Clean high-resolution downloads unlock after payment.</p>
          </div>
          <div className="card">
            <h3>Shop lead routing</h3>
            <p>Send serious customers to local paint shops, alert shops by email or SMS, and build an affiliate revenue stream.</p>
          </div>
        </section>

        <section className="section">
          <div className="card">
            <div className="topline">
              <div>
                <div className="eyebrow">The business model</div>
                <h2>Designs, downloads, and paint-shop commissions.</h2>
                <p>Beach House Creatives can sell digital concepts, premium downloads, custom requests, and qualified leads to paint shops.</p>
              </div>
              <div>
                <div className="stat">$10</div>
                <p className="tiny">starter download price</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">© Beach House Creatives — AI custom e-bike design studio.</footer>
      </div>
    </main>
  );
}