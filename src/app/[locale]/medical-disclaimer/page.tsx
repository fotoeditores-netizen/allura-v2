import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  return {
    title: isEn
      ? "Medical Disclaimer — Allura Healthcare"
      : "Aviso Médico Legal — Allura Healthcare",
    description: isEn
      ? "Medical disclaimer and important notices for international patients of Allura Healthcare in Medellín."
      : "Aviso médico legal y avisos importantes para pacientes internacionales de Allura Healthcare en Medellín.",
  };
}

export default function MedicalDisclaimerPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isEn = locale === "en";

  return (
    <>
      <section className="bg-brand-navy pt-40 pb-16 px-6 md:px-12 text-center">
        <div className="container-allura max-w-2xl mx-auto">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-blue mb-4">Legal</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            {isEn ? "Medical Disclaimer" : "Aviso Médico Legal"}
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

            {/* Important notice banner */}
            <div className="bg-brand-light border-l-4 border-brand-blue rounded-r-xl p-5">
              <p className="font-body text-sm text-brand-navy font-semibold leading-relaxed">
                {isEn
                  ? "IMPORTANT: The information provided on this website is for general informational purposes only. It does not constitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for any medical condition."
                  : "IMPORTANTE: La información proporcionada en este sitio web es únicamente con fines informativos generales. No constituye consejo médico profesional, diagnóstico ni tratamiento. Consulta siempre con un profesional de salud calificado para cualquier condición médica."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "1. Nature of information" : "1. Naturaleza de la información"}
              </h2>
              <p>
                {isEn
                  ? "The content on this website — including treatment descriptions, procedure timelines, outcomes and testimonials — is intended to provide general information about the dental and aesthetic medicine services offered by Allura Healthcare. This information does not replace a personalized clinical consultation."
                  : "El contenido de este sitio web — incluyendo descripciones de tratamientos, cronogramas de procedimientos, resultados y testimonios — tiene como objetivo proporcionar información general sobre los servicios de odontología y medicina estética ofrecidos por Allura Healthcare. Esta información no reemplaza una consulta clínica personalizada."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "2. Individual results" : "2. Resultados individuales"}
              </h2>
              <p>
                {isEn
                  ? "Medical and dental results vary depending on each patient's individual characteristics, including their health history, anatomy, oral health status and adherence to post-treatment instructions. Any results shown or described on this website represent individual cases and are not a guarantee of the outcomes you will obtain."
                  : "Los resultados médicos y odontológicos varían según las características individuales de cada paciente, incluyendo su historial de salud, anatomía, estado de salud bucal y cumplimiento de las instrucciones post-tratamiento. Cualquier resultado mostrado o descrito en este sitio web representa casos individuales y no constituye una garantía de los resultados que obtendrás."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "3. Virtual consultations" : "3. Consultas virtuales"}
              </h2>
              <p>
                {isEn
                  ? "Virtual consultations offered by Allura Healthcare are preliminary evaluations intended to guide potential patients about their treatment options. A definitive diagnosis and personalized treatment plan can only be established after an in-person clinical examination by the treating specialist."
                  : "Las consultas virtuales ofrecidas por Allura Healthcare son evaluaciones preliminares destinadas a orientar a los pacientes potenciales sobre sus opciones de tratamiento. Un diagnóstico definitivo y un plan de tratamiento personalizado solo pueden establecerse después de un examen clínico presencial por parte del especialista tratante."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "4. Risks and complications" : "4. Riesgos y complicaciones"}
              </h2>
              <p>
                {isEn
                  ? "All medical and dental procedures carry inherent risks and possible complications. At Allura Healthcare, our specialists will explain in detail the specific risks of your treatment during the consultation. We use internationally certified protocols to minimize risks, but no procedure is entirely free of them."
                  : "Todos los procedimientos médicos y odontológicos conllevan riesgos inherentes y posibles complicaciones. En Allura Healthcare, nuestros especialistas explicarán en detalle los riesgos específicos de tu tratamiento durante la consulta. Utilizamos protocolos certificados internacionalmente para minimizar los riesgos, pero ningún procedimiento está completamente libre de ellos."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "5. Third-party links" : "5. Enlaces de terceros"}
              </h2>
              <p>
                {isEn
                  ? "This website may contain links to third-party websites for informational purposes. Allura Healthcare is not responsible for the content, accuracy or privacy policies of external sites. The inclusion of any link does not imply endorsement by Allura Healthcare."
                  : "Este sitio web puede contener enlaces a sitios web de terceros con fines informativos. Allura Healthcare no es responsable del contenido, la exactitud ni las políticas de privacidad de los sitios externos. La inclusión de cualquier enlace no implica respaldo por parte de Allura Healthcare."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "6. Emergency situations" : "6. Situaciones de emergencia"}
              </h2>
              <p className="font-body text-brand-navy font-semibold">
                {isEn
                  ? "If you are experiencing a medical emergency, call your local emergency services immediately. Do not use this website or contact us via WhatsApp as a substitute for emergency medical care."
                  : "Si estás experimentando una emergencia médica, llama de inmediato a los servicios de emergencia locales. No utilices este sitio web ni nos contactes por WhatsApp como sustituto de la atención médica de emergencia."}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "7. Contact for medical inquiries" : "7. Contacto para consultas médicas"}
              </h2>
              <p>
                {isEn
                  ? "For questions about treatments or to schedule a virtual consultation with one of our specialists, contact us at "
                  : "Para preguntas sobre tratamientos o para agendar una consulta virtual con uno de nuestros especialistas, contáctanos en "}
                <a href="mailto:contact@allurahealthcare.com" className="text-brand-blue hover:underline">
                  contact@allurahealthcare.com
                </a>
                {isEn ? " or via WhatsApp." : " o por WhatsApp."}
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
