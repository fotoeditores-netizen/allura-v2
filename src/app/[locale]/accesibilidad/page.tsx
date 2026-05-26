import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/getSiteSettings";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  return {
    title: isEn ? "Accessibility Statement — Allura Healthcare" : "Declaración de accesibilidad — Allura Healthcare",
    description: isEn
      ? "Allura Healthcare web accessibility statement. Our commitment to digital inclusion."
      : "Declaración de accesibilidad web de Allura Healthcare. Nuestro compromiso con la inclusión digital.",
  };
}

export default async function AccesibilidadPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isEn = locale === "en";
  const settings = await getSiteSettings();
  const contactEmail = settings?.contactEmail || "contact@allurahealthcare.com";

  return (
    <>
      <section className="bg-brand-navy pt-40 pb-16 px-6 md:px-12 text-center">
        <div className="container-allura max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            {isEn ? "Accessibility Statement" : "Declaración de accesibilidad"}
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl mx-auto">
          <div className="space-y-8 font-body text-brand-silver leading-relaxed">

            <div>
              <p className="font-body text-xs text-brand-blue tracking-widest uppercase mb-2">
                {isEn ? "Last updated: May 2026" : "Última actualización: Mayo 2026"}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Our commitment" : "Nuestro compromiso"}
              </h2>
              <p>
                {isEn
                  ? "Allura Healthcare is committed to ensuring the accessibility of its website for all people, regardless of their abilities or the device they use. We aim to comply with WCAG 2.1 accessibility guidelines, level AA."
                  : "Allura Healthcare se compromete a garantizar la accesibilidad de su sitio web para todas las personas, independientemente de sus capacidades o el dispositivo que utilicen. Aspiramos a cumplir con las pautas de accesibilidad WCAG 2.1, nivel AA."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Conformance status" : "Estado de conformidad"}
              </h2>
              <p>
                {isEn
                  ? "This website is being developed with web accessibility best practices. We conduct periodic audits to identify and resolve accessibility barriers."
                  : "Este sitio web está siendo desarrollado con las mejores prácticas de accesibilidad web. Actualmente realizamos auditorías periódicas para identificar y resolver barreras de accesibilidad."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Measures implemented" : "Medidas implementadas"}
              </h2>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                {isEn ? (
                  <>
                    <li>Alternative text on images for screen reader users</li>
                    <li>Semantic HTML5 structure with correct heading hierarchy</li>
                    <li>Sufficient color contrast between text and background (minimum ratio 4.5:1)</li>
                    <li>Functional keyboard navigation on all interactive elements</li>
                    <li>ARIA labels on complex interface elements</li>
                    <li>Responsive design for mobile, tablet and desktop</li>
                    <li>Page language declared in HTML code</li>
                  </>
                ) : (
                  <>
                    <li>Textos alternativos en imágenes para usuarios con lectores de pantalla</li>
                    <li>Estructura semántica HTML5 con encabezados jerárquicos correctos</li>
                    <li>Contraste de color suficiente entre texto y fondo (ratio mínimo 4.5:1)</li>
                    <li>Navegación por teclado funcional en todos los elementos interactivos</li>
                    <li>Etiquetas ARIA en elementos de interfaz complejos</li>
                    <li>Diseño responsivo para dispositivos móviles, tabletas y escritorio</li>
                    <li>Idioma de la página declarado en el código HTML</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Known limitations" : "Limitaciones conocidas"}
              </h2>
              <p>
                {isEn
                  ? "We are working to improve the accessibility of multimedia content and downloadable documents. If you encounter any accessibility barrier, please let us know."
                  : "Estamos trabajando para mejorar la accesibilidad del contenido multimedia y los documentos descargables. Si encuentras alguna barrera de accesibilidad, por favor infórmanos."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Accessibility contact" : "Contacto de accesibilidad"}
              </h2>
              <p>
                {isEn
                  ? "If you have difficulty accessing any content on this site or need information in an alternative format, contact us:"
                  : "Si tienes dificultades para acceder a algún contenido de este sitio o necesitas la información en un formato alternativo, contáctanos:"}
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>
                  {isEn ? "Email: " : "Correo electrónico: "}
                  <a href={`mailto:${contactEmail}`} className="text-brand-blue hover:underline">{contactEmail}</a>
                </li>
                <li>{isEn ? "Response time: maximum 2 business days" : "Tiempo de respuesta: máximo 2 días hábiles"}</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "Continuous improvement" : "Proceso de mejora continua"}
              </h2>
              <p>
                {isEn
                  ? "We conduct periodic accessibility reviews and update this site in response to feedback received. This statement will be reviewed every 12 months or when significant changes are made to the site."
                  : "Realizamos revisiones periódicas de accesibilidad y actualizamos este sitio en respuesta a los comentarios recibidos. Esta declaración será revisada cada 12 meses o cuando se realicen cambios significativos en el sitio."}
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
