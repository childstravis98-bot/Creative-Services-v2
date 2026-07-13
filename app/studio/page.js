"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const conceptStyles = [
  "Coastal Teal",
  "Sunset Coral",
  "Stealth Black",
  "Retro Surf",
  "Electric Blue",
  "Candy Red",
  "Desert Camo",
  "Pearl White",
  "Chrome Silver",
  "Custom Mix",
];

export default function StudioPage() {
  const [bikeImage, setBikeImage] = useState("");
  const [bikeFileName, setBikeFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [description, setDescription] = useState("");
  const [concepts, setConcepts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      if (bikeImage) {
        URL.revokeObjectURL(bikeImage);
      }
    };
  }, [bikeImage]);

  function handleBikeUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please select an image smaller than 10 MB.");
      return;
    }

    if (bikeImage) {
      URL.revokeObjectURL(bikeImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setBikeImage(imageUrl);
    setBikeFileName(file.name);
    setConcepts([]);
  }

  function generateConcepts() {
    if (!bikeImage) {
      alert("Upload a photo of your e-bike first.");
      return;
    }

    if (!selectedStyle) {
      alert("Choose a design style first.");
      return;
    }

    setIsGenerating(true);
    setConcepts([]);

    window.setTimeout(() => {
      setConcepts(
        conceptStyles.map((name, index) => ({
          id: index + 1,
          name,
          className: `concept-${index + 1}`,
        }))
      );

      setIsGenerating(false);
    }, 1200);
  }

  function resetStudio() {
    if (bikeImage) {
      URL.revokeObjectURL(bikeImage);
    }

    setBikeImage("");
    setBikeFileName("");
    setSelectedStyle("");
    setDescription("");
    setConcepts([]);
  }

  return (
    <main className="page">
      <div className="wrap">
        <nav className="nav">
          <Link href="/" className="brand">
            Beach House
            <span>CREATIVES</span>
          </Link>

          <div className="navlinks">
            <Link className="pill" href="/">
              Home
            </Link>
            <Link className="pill" href="/pricing">
              Pricing
            </Link>
            <Link className="pill" href="/shops">
              Paint Shops
            </Link>
            <Link className="pill" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </nav>

        <section className="hero studio-hero">
          <div className="eyebrow">AI E-Bike Design Studio</div>

          <h1>Upload your bike. Create your look.</h1>

          <p className="lead">
            Upload a clear side-view photograph, choose a paint direction,
            and preview ten Beach House Creatives design concepts.
          </p>
        </section>

        <section className="section studio-grid">
          <div className="card">
            <div className="step-label">Step 1</div>
            <h2>Upload Your E-Bike</h2>

            <label className="upload-area">
              <input
                className="file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBikeUpload}
              />

              <span className="upload-title">
                {bikeImage ? "Choose a different photo" : "Choose bike photo"}
              </span>

              <span className="upload-help">
                JPG, PNG or WebP — maximum 10 MB
              </span>
            </label>

            {bikeFileName && (
              <p className="tiny uploaded-file">
                Selected: {bikeFileName}
              </p>
            )}

            <input placeholder="Your name" />

            <input type="email" placeholder="Email address" />

            <input placeholder="E-bike make and model" />

            <select
              value={selectedStyle}
              onChange={(event) => setSelectedStyle(event.target.value)}
            >
              <option value="">Choose a design style</option>
              <option>Surf & Coastal</option>
              <option>Racing & Speed</option>
              <option>Stealth Matte</option>
              <option>Retro Vintage</option>
              <option>Neon Cyber</option>
              <option>Camo Adventure</option>
              <option>Chrome Metallic</option>
              <option>Custom Theme</option>
            </select>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the design you want. Example: Ventura surf theme, teal and orange fade, matte black accents."
            />

            <button
              type="button"
              className="generate-button"
              onClick={generateConcepts}
              disabled={isGenerating}
            >
              {isGenerating
                ? "Creating Concepts..."
                : "Generate 10 Design Concepts"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={resetStudio}
            >
              Start Over
            </button>
          </div>

          <div className="card preview-card">
            <div className="step-label">Step 2</div>
            <h2>Bike Preview</h2>

            <div className={bikeImage ? "bike-preview active" : "bike-preview"}>
              {bikeImage ? (
                <>
                  <img src={bikeImage} alt="Uploaded e-bike preview" />
                  <span className="watermark">
                    Beach House Creatives Preview
                  </span>
                </>
              ) : (
                <div className="empty-preview">
                  <strong>Your e-bike will appear here</strong>
                  <span>Upload a clear photograph to begin.</span>
                </div>
              )}
            </div>

            <p className="tiny">
              For the best result, use a bright, clear side-view photograph
              with the full bike visible.
            </p>
          </div>
        </section>

        {isGenerating && (
          <section className="section">
            <div className="card generation-status">
              <div className="loading-ring" />
              <div>
                <h3>Preparing your design collection</h3>
                <p>
                  Building ten preview directions based on your selected style.
                </p>
              </div>
            </div>
          </section>
        )}

        {concepts.length > 0 && (
          <section className="section">
            <div className="eyebrow">Step 3</div>
            <h2>Your Design Concepts</h2>

            <p>
              These are demonstration preview treatments. The next connection
              will replace them with actual OpenAI-generated bike designs.
            </p>

            <div className="concept-grid">
              {concepts.map((concept) => (
                <article
                  className={`concept-card ${concept.className}`}
                  key={concept.id}
                >
                  <div
                    className="concept-image"
                    style={{
                      backgroundImage: bikeImage
                        ? `linear-gradient(135deg, rgba(0,0,0,.08), rgba(0,0,0,.5)), url("${bikeImage}")`
                        : "none",
                    }}
                  >
                    <span className="concept-number">
                      Concept {concept.id}
                    </span>

                    <span className="watermark">
                      Beach House Creatives
                    </span>
                  </div>

                  <div className="concept-details">
                    <h3>{concept.name}</h3>

                    <p className="tiny">
                      {selectedStyle}
                      {description ? ` — ${description}` : ""}
                    </p>

                    <Link className="button secondary" href="/pricing">
                      Unlock Design
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer className="footer">
          © Beach House Creatives — AI custom e-bike design studio.
        </footer>
      </div>
   </main>
  );
}
