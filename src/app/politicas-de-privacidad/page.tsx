import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de privacidad — Allura Healthcare",
  description: "Política de privacidad y tratamiento de datos personales de Allura Healthcare.",
};

export default function PoliticasPrivacidadPage() {
  return (
    <>
      <section className="bg-brand-navy pt-40 pb-16 px-6 md:px-12 text-center">
        <div className="container-allura max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Políticas de privacidad
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl mx-auto prose prose-allura">
          <div className="space-y-8 font-body text-brand-silver leading-relaxed">

            <div>
              <p className="font-body text-xs text-brand-blue tracking-widest uppercase mb-2">Última actualización: Mayo 2026</p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">1. Responsable del tratamiento</h2>
              <p>
                Allura Healthcare (en adelante, "Allura") es responsable del tratamiento de los datos personales recopilados a través de este sitio web. Puedes contactarnos en{" "}
                <a href="mailto:info@allura.co" className="text-brand-blue hover:underline">info@allura.co</a>.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">2. Datos que recopilamos</h2>
              <p>Recopilamos la siguiente información cuando usas nuestros servicios:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Nombre completo y datos de contacto (email, teléfono)</li>
                <li>Información relacionada con tu consulta o servicio de interés</li>
                <li>Datos de navegación anónimos mediante cookies</li>
                <li>Comunicaciones por correo electrónico o WhatsApp cuando inicias contacto con nosotros</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">3. Finalidad del tratamiento</h2>
              <p>Usamos tus datos para:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Responder a tus consultas y solicitudes de información</li>
                <li>Coordinar citas y procedimientos médicos</li>
                <li>Enviarte información relevante sobre nuestros servicios si lo has solicitado</li>
                <li>Mejorar la experiencia de navegación en nuestro sitio web</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">4. Base legal</h2>
              <p>
                El tratamiento de tus datos se basa en tu consentimiento explícito al completar nuestros formularios de contacto, o en la ejecución de un contrato o precontrato de prestación de servicios médicos.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">5. Conservación de datos</h2>
              <p>
                Conservamos tus datos personales mientras exista una relación activa contigo o hasta que solicites su eliminación, salvo obligación legal de conservarlos por mayor tiempo.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">6. Tus derechos</h2>
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar datos inexactos o incompletos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
                <li>Presentar una reclamación ante la autoridad de protección de datos competente</li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, escríbenos a{" "}
                <a href="mailto:info@allura.co" className="text-brand-blue hover:underline">info@allura.co</a>.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">7. Cookies</h2>
              <p>
                Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento. No utilizamos cookies de seguimiento o publicidad sin tu consentimiento previo.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">8. Cambios en esta política</h2>
              <p>
                Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través del sitio web o por correo electrónico si eres cliente activo.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
