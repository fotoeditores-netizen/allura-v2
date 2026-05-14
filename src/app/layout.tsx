import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Allura Healthcare — Turismo Médico en Medellín",
  description:
    "Allura es una marca colombiana de turismo médico en Medellín que integra tratamientos médicos, estéticos y odontológicos con la calidez y el disfrute de Colombia.",
  keywords: ["turismo médico", "Medellín", "Colombia", "salud", "estética", "odontología"],
  openGraph: {
    title: "Allura Healthcare",
    description: "Tu transformación comienza en Medellín",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
