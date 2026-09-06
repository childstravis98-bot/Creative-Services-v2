"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "bhcPendingPaidDesign";

export default function StudioPage() {
  const [bikeImage, setBikeImage] = useState("");
  const [bikeFile, setBikeFile] = useState(null);
  const [bikeFileName, setBikeFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    async function checkReturnedPayment() {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      const cancelled = params.get("checkout") === "cancelled";

      if (cancelled) {
        setPaymentMessage(
          "Checkout was cancelled. Your design is still here."
        );
        window.history.replaceState({}, "", "/studio");
        return;
      }

      if (!sessionId) return;

      setPaymentMessage("Confirming your Stripe payment...");

      try {
        const response = await fetch(
          `/api/checkout?session_id=${encodeURIComponent(sessionId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.paid) {
          throw new Error(
            data.error || "Payment could not be confirmed."
          );
        }

        const storedDesign =
          localStorage.getItem(STORAGE_KEY);

        if (!storedDesign) {
          throw new Error(
            "Payment was confirmed, but this browser no longer has the generated design."
          );
        }

        setGeneratedImage(storedDesign);
        setIsPaid(true);

        setPaymentMessage(
          "Payment confirmed. Your full design is unlocked."
        );

        window.history.replaceState({}, "", "/studio");
      } catch (error) {
        setErrorMessage(
          error?.message ||
            "Payment could not be confirmed."
        );

        setPaymentMessage("");
      }
    }

    checkReturnedPayment();
  }, []);

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
      alert(
        "Please select an image smaller than 10 MB."
      );
      return;
    }

    if (bikeImage) {
      URL.revokeObjectURL(bikeImage);
    }

    setBikeFile(file);
    setBikeImage(URL.createObjectURL(file));
    setBikeFileName(file.name);
    setGeneratedImage("");
    setErrorMessage("");
    setPaymentMessage("");
    setIsPaid(false);

    localStorage.removeItem(STORAGE_KEY);
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
    setPaymentMessage("");
    setIsPaid(false);

    localStorage.removeItem(STORAGE_KEY);

    try {
      const formData = new FormData();

      formData.append("image", bikeFile);
      formData.append("style", selectedStyle);
      formData.append("description", description);

      const response = await fetch(
        "/api/generate-design",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "The design could not be generated."
        );
      }

      setGeneratedImage(data.image);
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "The design could not be generated."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function buyDesign() {
    if (!generatedImage) {
      alert("Generate a design first.");
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage("");
    setPaymentMessage("");

    try {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          generatedImage
        );
      } catch {
        throw new Error(
          "The generated design is too large for checkout storage. Try again with a smaller source photo."
        );
      }

      const response = await fetch(
        "/api/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            style: selectedStyle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ||
            "Checkout could not be started."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Checkout could not be started."
      );

      setIsCheckingOut(false);
    }
  }

  function resetStudio() {
    if (bikeImage) {
      URL.revokeObjectURL(bikeImage);
    }

    setBikeImage("");
    setBikeFile(null);
    setBikeFileName("");
    setSelectedStyle("");
    setDescription("");
    setGeneratedImage("");
    setErrorMessage("");
    setPaymentMessage("");
    setIsPaid(false);

    localStorage.removeItem(STORAGE_KEY);
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
            <Link
              className="pill"
              href="/"
            >
              Home
            </Link>
          </div>
        </nav>

        <section className="hero studio-hero">

          <div className="eyebrow">
            AI E-Bike Design Studio
          </div>

          <h1>
            Upload your bike. Create your look.
          </h1>

          <p className="lead">
            Upload a clear side-view photograph,
            choose a paint direction, and generate
            a real AI custom-paint concept.
          </p>

        </section>

        <section className="section studio-grid">

          <div className="card">

            <div className="step-label">
              Step 1
            </div>

            <h2>
              Upload Your E-Bike
            </h2>

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
                setSelectedStyle(
                  event.target.value
                )
              }
            >

              <option value="">
                Choose a design style
              </option>

              <option>
                Surf & Coastal
              </option>

              <option>
                Racing & Speed
              </option>

              <option>
                Stealth Matte
              </option>

              <option>
                Retro Vintage
              </option>

              <option>
                Neon Cyber
              </option>

              <option>
                Camo Adventure
              </option>

              <option>
                Chrome Metallic
              </option>

              <option>
                Custom Theme
              </option>

            </select>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
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

            {paymentMessage && (
              <p
                style={{
                  color: "#7ee8d8",
                  fontWeight: 700,
                }}
              >
                {paymentMessage}
              </p>
            )}

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

            <div className="step-label">
              Step 2
            </div>

            <h2>
              {generatedImage
                ? isPaid
                  ? "Purchased Design"
                  : "AI Paint Concept"
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

                  {!isPaid && (
                    <span className="watermark">
                      Beach House Creatives Preview
                    </span>
                  )}

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

                  <strong>
                    Your e-bike will appear here
                  </strong>

                  <span>
                    Upload a clear photograph
                    to begin.
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
                  <h3>
                    Creating your paint concept
                  </h3>

                  <p className="tiny">
                    This may take up to a minute.
                  </p>
                </div>

              </div>
            )}

            {generatedImage && !isPaid && (
              <div className="actions">

                <button
                  type="button"
                  className="button primary"
                  onClick={buyDesign}
                  disabled={isCheckingOut}
                  style={{
                    border: 0,
                    cursor: "pointer",
                  }}
                >
                  {isCheckingOut
                    ? "Opening Secure Checkout..."
                    : "Buy Full Design — $10"}
                </button>

                <p className="tiny">
                  Secure payment by Stripe.
                  Your download unlocks after
                  payment is confirmed.
                </p>

              </div>
            )}

            {generatedImage && isPaid && (
              <div className="actions">

                <a
                  className="button primary"
                  href={generatedImage}
                  download="beach-house-creatives-ebike-design.png"
                >
                  Download Full Design
                </a>

                <button
                  type="button"
                  className="button secondary"
                  onClick={resetStudio}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Create Another Design
                </button>

              </div>
            )}

            <p className="tiny">
              For the best result, use a bright,
              clear side-view photograph with the
              full bike visible.
            </p>

          </div>

        </section>

        <footer className="footer">
          © Beach House Creatives —
          AI custom e-bike design studio.
        </footer>

      </div>
    </main>
  );
}
