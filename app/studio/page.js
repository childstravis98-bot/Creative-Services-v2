"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudioPage() {
  const [bikeImage, setBikeImage] = useState("");
  const [bikeFile, setBikeFile] = useState(null);
  const [bikeFileName, setBikeFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    return () => {
      if (bikeImage) URL.revokeObjectURL(bikeImage);
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

    if (bikeImage) URL.revokeObjectURL(bikeImage);

    setBikeFile(file);
    setBikeImage(URL.createObjectURL(file));
    setBikeFileName(file.name);
    setGeneratedImage("");
    setErrorMessage("");
  }

  async function generateConcept() {
    if (!bikeFile) {
      alert("Upload a photo of your e-bike first.");
      return;
    }

    if (!selectedStyle) {
      alert("Choose a design style first.");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("image", bikeFile);
      formData.append("style", selectedStyle);
      formData.append("description", description);

      const response = await fetch("/api/generate-design", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The design could not be generated.");
      }

      setGeneratedImage(data.image);
    } catch (error) {
      setErrorMessage(
        error.message || "The design could not be generated."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function resetStudio() {
    if (bikeImage) URL.revokeObjectURL(bikeImage);

    setBikeImage("");
    setBikeFile(null);
    setBikeFileName("");
    setSelectedStyle("");
    setDescription("");
    setGeneratedImage("");
    setErrorMessage("");
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
            <Link className="pill" href="/">Home</Link>
            <Link className="pill" href="/pricing">Pricing</Link>
            <Link className="pill" href="/shops">Paint Shops</Link>
            <Link className="pill" href="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <section className="hero studio-hero">
          <div className="eyebrow">AI E-Bike Design Studio</div>

          <h1>Upload your bike. Create your look.</h1>

          <p className="lead">
            Upload a clear side-view photograph, choose a paint direction,
            and generate a real AI custom-paint concept.
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
                {bikeImage
                  ? "Choose a different photo"
                  : "Choose bike photo"}
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

            <select
              value={selectedStyle}
              onChange={(event) =>
                setSelectedStyle(event.target.value)
              }
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
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the design you want. Example: Ventura surf theme, teal and orange fade, matte black accents."
            />

            <button
              type="button"
              className="generate-button"
              onClick={generateConcept}
              disabled={isGenerating}
            >
              {isGenerating
                ? "Generating Real AI Design..."
                : "Generate Real AI Design"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={resetStudio}
            >
              Start Over
            </button>

            {errorMessage && (
              <p
                style={{
                  color: "#ff9b8a",
                  fontWeight: 700,
                }}
              >
                {errorMessage}
              </p>
            )}
          </div>

          <div className="card preview-card">
            <div className="step-label">Step 2</div>

            <h2>
              {generatedImage
                ? "AI Paint Concept"
                : "Bike Preview"}
            </h2>

            <div
              className={
                bikeImage || generatedImage
                  ? "bike-preview active"
                  : "bike-preview"
              }
            >
              {generatedImage ? (
                <>
                  <img
                    src={generatedImage}
                    alt="AI-generated e-bike paint concept"
                  />
                  <span className="watermark">
                    Beach House Creatives Preview
                  </span>
                </>
              ) : bikeImage ? (
                <>
                  <img
                    src={bikeImage}
                    alt="Uploaded e-bike preview"
                  />
                  <span className="watermark">
                    Original Bike Preview
                  </span>
                </>
              ) : (
                <div className="empty-preview">
                  <strong>Your e-bike will appear here</strong>
                  <span>
                    Upload a clear photograph to begin.
                  </span>
                </div>
              )}
            </div>

            {isGenerating && (
              <div
                className="generation-status"
                style={{ marginTop: 18 }}
              >
                <div className="loading-ring" />

                <div>
                  <h3>Creating your paint concept</h3>
                  <p className="tiny">
                    This may take up to a minute.
                  </p>
                </div>
              </div>
            )}

            {generatedImage && (
              <div className="actions">
                <a
                  className="button primary"
                  href={generatedImage}
                  download="beach-house-creatives-ebike-design.png"
                >
                  Download Preview
                </a>

                <Link
                  className="button secondary"
                  href="/pricing"
                >
                  Buy This Design
                </Link>
              </div>
            )}

            <p className="tiny">
              For the best result, use a bright, clear side-view
              photograph with the full bike visible.
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
