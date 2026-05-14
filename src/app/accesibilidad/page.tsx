import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaración de accesibilidad — Allura Healthcare",
  description: "Declaración de accesibilidad web de Allura Healthcare. Nuestro compromiso con la inclusión digital.",
};

export default function AccesibilidadPage() {
  return (
    <>
      <section className="bg-brand-navy pt-40 pb-16 px-6 md:px-12 text-center">
        <div className="container-allura max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Declaración de accesibilidad
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl mx-auto">
          <div className="space-y-8 font-body text-brand-silver leading-relaxed">

            <div>
              <p className="font-body text-xs text-brand-blue tracking-widest uppercase mb-2">Última actualización: Mayo 2026</p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Nuestro compromiso</h2>
              <p>
                Allura Healthcare se compromete a garantizar la accesibilidad de su sitio web para todas las personas, independientemente de sus capacidades o el dispositivo que utilicen. Aspiramos a cumplir con las pautas de accesibilidad WCAG 2.1, nivel AA.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Estado de conformidad</h2>
              <p>
                Este sitio web está siendo desarrollado con las mejores prácticas de accesibilidad web. Actualmente realizamos auditorías periódicas para identificar y resolver barreras de accesibilidad.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Medidas implementadas</h2>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Textos alternativos en imágenes para usuarios con lectores de pantalla</li>
                <li>Estructura semántica HTML5 con encabezados jerárquicos correctos</li>
                <li>Contraste de color suficiente entre texto y fondo (ratio mínimo 4.5:1)</li>
                <li>Navegación por teclado funcional en todos los elementos interactivos</li>
                <li>Etiquetas ARIA en elementos de interfaz complejos</li>
                <li>Diseño responsivo para dispositivos móviles, tabletas y escritorio</li>
                <li>Idioma de la página declarado en el código HTML</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Limitaciones conocidas</h2>
              <p>
                Estamos trabajando para mejorar la accesibilidad del contenido multimedia y los documentos descargables. Si encuentras alguna barrera de accesibilidad, por favor infórmanos.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Contacto de accesibilidad</h2>
              <p>
                Si tienes dificultades para acceder a algún contenido de este sitio o necesitas la información en un formato alternativo, contáctanos:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>
                  Correo electrónico:{" "}
                  <a href="mailto:info@allura.co" className="text-brand-blue hover:underline">info@allura.co</a>
                </li>
                <li>Tiempo de respuesta: máximo 2 días hábiles</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">Proceso de mejora continua</h2>
              <p>
                Realizamos revisiones periódicas de accesibilidad y actualizamos este sitio en respuesta a los comentarios recibidos. Esta declaración será revisada cada 12 meses o cuando se realicen cambios significativos en el sitio.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
