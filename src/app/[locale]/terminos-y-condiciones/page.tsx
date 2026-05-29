import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/getSiteSettings";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const isEn = locale === "en";
  const siteName = settings?.siteName || "Allura Healthcare";
  const ogImageUrl = settings?.seoImageUrl;
  const title = isEn
    ? `Terms and Conditions | ${siteName}`
    : `Términos y condiciones | ${siteName}`;
  const description = isEn
    ? "Terms and conditions of use for Allura Healthcare services."
    : "Términos y condiciones de uso de los servicios de Allura Healthcare.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
  };
}

export default async function TerminosYCondicionesPage({
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
            {isEn ? "Terms & Conditions" : "Términos y Condiciones"}
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
                {isEn ? "1. Acceptance of terms" : "1. Aceptación de los términos"}
              </h2>
              <p>
                {isEn
                  ? "By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services."
                  : "Al acceder y utilizar este sitio web, aceptas y te comprometes a cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestro sitio web ni nuestros servicios."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "2. Description of services" : "2. Descripción de servicios"}
              </h2>
              <p>
                {isEn
                  ? "Allura Healthcare offers medical tourism services specializing in premium dentistry and facial aesthetic medicine in Medellín, Colombia. Our services include initial virtual consultations, treatment coordination, and on-site procedures performed by certified specialists."
                  : "Allura Healthcare ofrece servicios de turismo médico especializados en odontología premium y medicina facial estética en Medellín, Colombia. Nuestros servicios incluyen consultas virtuales iniciales, coordinación de tratamientos y procedimientos presenciales realizados por especialistas certificados."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "3. Use of the website" : "3. Uso del sitio web"}
              </h2>
              <p>{isEn ? "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. Specifically, you agree not to:" : "Aceptas utilizar este sitio web únicamente para fines lícitos y de manera que no infrinja los derechos de terceros. En particular, aceptas no:"}</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                {isEn ? (
                  <>
                    <li>Transmit any unsolicited or unauthorized advertising material</li>
                    <li>Attempt to gain unauthorized access to any part of the website</li>
                    <li>Use the website in any way that could damage or impair its functionality</li>
                    <li>Reproduce, duplicate, or copy content for commercial purposes without prior written consent</li>
                  </>
                ) : (
                  <>
                    <li>Transmitir material publicitario no solicitado o no autorizado</li>
                    <li>Intentar obtener acceso no autorizado a cualquier parte del sitio web</li>
                    <li>Usar el sitio web de cualquier forma que pueda dañar o perjudicar su funcionamiento</li>
                    <li>Reproducir, duplicar o copiar contenido con fines comerciales sin consentimiento previo por escrito</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "4. Appointments and consultations" : "4. Citas y consultas"}
              </h2>
              <p>
                {isEn
                  ? "Virtual consultations and appointments requested through our website or WhatsApp are subject to specialist availability. Allura Healthcare reserves the right to reschedule or cancel appointments due to unforeseen circumstances, providing timely notice to the patient."
                  : "Las consultas virtuales y citas solicitadas a través de nuestro sitio web o WhatsApp están sujetas a la disponibilidad del especialista. Allura Healthcare se reserva el derecho de reprogramar o cancelar citas por circunstancias imprevistas, proporcionando aviso oportuno al paciente."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "5. Prices and payments" : "5. Precios y pagos"}
              </h2>
              <p>
                {isEn
                  ? "Prices for treatments are provided as estimates during the virtual consultation and may vary depending on the specific clinical assessment. Final quotes are confirmed in writing before any procedure begins. Allura Healthcare is transparent about all costs and does not apply hidden charges."
                  : "Los precios de los tratamientos se proporcionan como estimados durante la consulta virtual y pueden variar según la evaluación clínica específica. Las cotizaciones finales se confirman por escrito antes de iniciar cualquier procedimiento. Allura Healthcare es transparente sobre todos los costos y no aplica cargos ocultos."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "6. Intellectual property" : "6. Propiedad intelectual"}
              </h2>
              <p>
                {isEn
                  ? "All content on this website — including texts, images, logos, graphics and design — is the exclusive property of Allura Healthcare or its licensors and is protected by copyright laws. Reproduction without prior written authorization is prohibited."
                  : "Todo el contenido de este sitio web — incluyendo textos, imágenes, logotipos, gráficos y diseño — es propiedad exclusiva de Allura Healthcare o sus licenciantes y está protegido por las leyes de derechos de autor. Su reproducción sin autorización previa y por escrito está prohibida."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "7. Limitation of liability" : "7. Limitación de responsabilidad"}
              </h2>
              <p>
                {isEn
                  ? "The information on this website is provided for general informational purposes only and does not constitute medical advice. Allura Healthcare is not liable for decisions made based on the website content without prior consultation with a qualified specialist."
                  : "La información en este sitio web se proporciona únicamente con fines informativos generales y no constituye consejo médico. Allura Healthcare no es responsable de las decisiones tomadas basándose en el contenido del sitio web sin previa consulta con un especialista calificado."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "8. Governing law" : "8. Ley aplicable"}
              </h2>
              <p>
                {isEn
                  ? "These Terms and Conditions are governed by the laws of the Republic of Colombia. Any dispute arising from the use of this website or our services will be subject to the jurisdiction of the courts of Medellín, Antioquia."
                  : "Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier controversia derivada del uso de este sitio web o nuestros servicios estará sujeta a la jurisdicción de los tribunales de Medellín, Antioquia."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "9. Contact" : "9. Contacto"}
              </h2>
              <p>
                {isEn ? "For questions about these Terms and Conditions, write to us at " : "Para preguntas sobre estos Términos y Condiciones, escríbenos a "}
                <a href={`mailto:${contactEmail}`} className="text-brand-blue hover:underline">
                  {contactEmail}
                </a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
