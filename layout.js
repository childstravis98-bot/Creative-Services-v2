import "./globals.css";

export const metadata = {
  title: "Beach House Creatives | AI E-Bike Paint Studio",
  description: "Upload your e-bike, generate custom AI paint concepts, save designs, and connect with paint shops."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}