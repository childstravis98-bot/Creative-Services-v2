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
         
