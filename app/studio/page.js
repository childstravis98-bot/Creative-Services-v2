import Link from "next/link";

export default function StudioPage() {
  return (
    <main className="page">
      <div className="wrap">
        <nav className="nav">
          <Link href="/" className="brand">Beach House<span>CREATIVES</span></Link>
          <div className="navlinks">
            <Link className="pill" href="/">Home</Link>
            <Link className="pill" href="/pricing">Pricing</Link>
            <Link className="pill" href="/shops">Paint Shops</Link>
            <Link className="pill" href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="eyebrow">Upload Your Bike</div>
          <h1>Start your custom e-bike paint design.</h1>
          <p className="lead">
            Upload a bike photo, describe the style, and request AI-generated paint concepts from Beach House Creatives.
          </p>
        </section>

        <section className="section grid">
          <div className="card">
            <h2>Design Request</h2>
            <p>
              Use this starter form for the first live version. Next we can connect photo upload,
              OpenAI image generation, and Stripe checkout.
            </p>

            <input placeholder="Your name" />
            <input placeholder="Email address" />
            <input placeholder="E-bike make and model" />

            <select defaultValue="">
              <option value="" disabled>Choose a style</option>
              <option>Surf & Coastal</option>
              <option>Racing & Speed</option>
              <option>Stealth Matte</option>
              <option>Retro Vintage</option>
              <option>Neon Cyber</option>
              <option>Camo Adventure</option>
              <option>Chrome Metallic</option>
              <option>Custom Theme</option>
            </select>

            <textarea placeholder="Describe the paint design you want. Example: Ventura surf theme, teal and orange fade, matte black accents." />

            <button>Request Design Preview</button>
          </div>

          <div className="card">
            <h2>Preview Area</h2>
            <div className="mock">
              E-bike design preview will appear here
              <span className="watermark">Beach House Creatives Preview</span>
            </div>
            <p className="tiny">
              Future upgrade: uploaded bike image, 10 AI concepts, watermark preview, paid clean download.
            </p>
          </div>
        </section>

        <footer className="footer">
          © Beach House Creatives — AI custom e-bike design studio.
        </footer>
      </div>
    </main>
  );
}
