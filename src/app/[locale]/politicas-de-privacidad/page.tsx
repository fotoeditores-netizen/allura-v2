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
    ? `Privacy Policy | ${siteName}`
    : `Políticas de privacidad | ${siteName}`;
  const description = isEn
    ? "Privacy policy and personal data processing at Allura Healthcare."
    : "Política de privacidad y tratamiento de datos personales de Allura Healthcare.";
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

export default async function PoliticasPrivacidadPage({
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
            {isEn ? "Privacy Policy" : "Políticas de privacidad"}
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-allura max-w-3xl mx-auto prose prose-allura">
          <div className="space-y-8 font-body text-brand-silver leading-relaxed">

            <div>
              <p className="font-body text-xs text-brand-blue tracking-widest uppercase mb-2">
                {isEn ? "Last updated: May 2026" : "Última actualización: Mayo 2026"}
              </p>
              <p>
                {isEn
                  ? "ALLURA respects your privacy. This Privacy Policy describes how we collect, use, and safeguard your personal information."
                  : "En Allura Healthcare, respetamos y protegemos la privacidad de nuestros usuarios, pacientes y visitantes. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal que nos proporcionas a través de nuestro sitio web y servicios."}
              </p>
            </div>

            {/* Section 1 — Information We Collect */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "1. Information We Collect" : "1. Información que recopilamos"}
              </h2>
              {isEn ? (
                <>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li><strong>Personal Information:</strong> name, email address, phone number, city/state.</li>
                    <li><strong>Optional Information:</strong> basic details relevant to your service inquiry (never including medical records).</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Podemos recopilar los siguientes datos personales a través de nuestro sitio web y canales de contacto:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Información de identificación: nombre, apellido</li>
                    <li>Información de contacto: correo electrónico, número de teléfono</li>
                    <li>Información médica básica (cuando el usuario la proporciona voluntariamente)</li>
                    <li>Información sobre procedimientos de interés</li>
                    <li>Preferencias de contacto</li>
                    <li>Información de navegación (cookies, dirección IP, tipo de dispositivo)</li>
                  </ul>
                  <p className="mt-3">Estos datos se recopilan principalmente a través de formularios de contacto y consultas en línea.</p>
                </>
              )}
            </div>

            {/* Section 2 — How We Use Information */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "2. How We Use Information" : "2. Finalidad del tratamiento de datos"}
              </h2>
              <p>{isEn ? "We may use your information to:" : "Utilizamos la información recopilada para:"}</p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                {isEn ? (
                  <>
                    <li>Respond to inquiries and provide estimates</li>
                    <li>Coordinate contact with partner clinics or travel operators</li>
                    <li>Improve our Website and marketing communications</li>
                    <li>Comply with legal obligations</li>
                  </>
                ) : (
                  <>
                    <li>Contactarte y brindarte asesoría personalizada</li>
                    <li>Coordinar consultas médicas y procesos de turismo de salud</li>
                    <li>Gestionar solicitudes, citas y servicios</li>
                    <li>Mejorar nuestros servicios y experiencia del usuario</li>
                    <li>Cumplir obligaciones legales y regulatorias</li>
                  </>
                )}
              </ul>
            </div>

            {/* Section 3 — Sensitive Data (ES) / Data Sharing (EN) */}
            {isEn ? (
              <div>
                <h2 className="font-heading text-2xl text-brand-navy mb-3">3. Data Sharing</h2>
                <p>We may share your information only with:</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Partner clinics or travel operators necessary to fulfill your request</li>
                  <li>Service providers assisting in marketing, hosting, or analytics</li>
                  <li>Governmental authorities if required by law</li>
                </ul>
                <p className="mt-3">All partners are bound by confidentiality obligations.</p>
              </div>
            ) : (
              <div>
                <h2 className="font-heading text-2xl text-brand-navy mb-3">3. Tratamiento de datos sensibles</h2>
                <p>En algunos casos, podríamos tratar datos sensibles relacionados con tu salud, siempre:</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Con tu consentimiento previo, expreso e informado</li>
                  <li>Únicamente para fines médicos o de asesoría en tratamientos</li>
                  <li>Bajo estrictas medidas de confidencialidad</li>
                </ul>
              </div>
            )}

            {/* Section 4 — HIPAA (EN) / Data Sharing (ES) */}
            {isEn ? (
              <div>
                <h2 className="font-heading text-2xl text-brand-navy mb-3">4. HIPAA Notice</h2>
                <p>
                  Although ALLURA is not a healthcare provider under HIPAA, we voluntarily apply equivalent safeguards for any limited health-related data received.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-heading text-2xl text-brand-navy mb-3">4. Compartición de la información</h2>
                <p>Tu información podrá ser compartida con:</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Profesionales de la salud y clínicas aliadas</li>
                  <li>Proveedores de servicios necesarios (agenda, comunicación, alojamiento)</li>
                  <li>Autoridades, cuando sea requerido por ley</li>
                </ul>
                <p className="mt-3">En ningún caso vendemos tu información personal a terceros.</p>
              </div>
            )}

            {/* Section 5 — Security */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "5. Security Measures" : "5. Protección de la información"}
              </h2>
              {isEn ? (
                <p>We use SSL encryption, restricted access, and data retention policies consistent with industry standards.</p>
              ) : (
                <>
                  <p>Implementamos medidas de seguridad técnicas, administrativas y organizativas para proteger tus datos contra:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Acceso no autorizado</li>
                    <li>Pérdida o uso indebido</li>
                    <li>Alteración o divulgación</li>
                  </ul>
                  <p className="mt-3">Sin embargo, ningún sistema es completamente seguro, por lo que no podemos garantizar seguridad absoluta.</p>
                </>
              )}
            </div>

            {/* Section 6 — Cookies */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "6. Cookies" : "6. Uso de cookies"}
              </h2>
              {isEn ? (
                <p>
                  This website may use technical cookies necessary for its operation. We do not use tracking or advertising cookies without your prior consent.
                </p>
              ) : (
                <>
                  <p>Nuestro sitio web puede utilizar cookies y tecnologías similares para:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Analizar el comportamiento de navegación</li>
                    <li>Mejorar la experiencia del usuario</li>
                    <li>Recordar preferencias</li>
                  </ul>
                  <p className="mt-3">Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar el funcionamiento del sitio.</p>
                </>
              )}
            </div>

            {/* Section 7 — Your Rights */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "7. Your Rights" : "7. Derechos del titular de los datos"}
              </h2>
              {isEn ? (
                <>
                  <p>
                    You may request access, correction, or deletion of your data by writing to{" "}
                    <a href={`mailto:${contactEmail}`} className="text-brand-blue hover:underline">
                      {contactEmail}
                    </a>.
                  </p>
                </>
              ) : (
                <>
                  <p>De acuerdo con la legislación colombiana, tienes derecho a:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>Conocer, actualizar y rectificar tus datos</li>
                    <li>Solicitar prueba de autorización</li>
                    <li>Revocar el consentimiento</li>
                    <li>Solicitar la eliminación de tus datos</li>
                    <li>Presentar quejas ante la autoridad competente</li>
                  </ul>
                </>
              )}
            </div>

            {/* Section 8 — Data Retention */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "8. Data Retention" : "8. Tratamiento de datos de menores"}
              </h2>
              {isEn ? (
                <p>We retain personal data only as long as necessary to fulfill the purposes above.</p>
              ) : (
                <p>
                  Nuestros servicios no están dirigidos a menores de edad. No recopilamos intencionalmente información de menores sin autorización de sus representantes legales.
                </p>
              )}
            </div>

            {/* Section 9 — International Transfers (EN) / Third-party links (ES) */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "9. International Transfers" : "9. Enlaces a terceros"}
              </h2>
              {isEn ? (
                <p>
                  Data may be transferred to and processed in Colombia for coordination purposes. ALLURA ensures contractual safeguards consistent with U.S. and Colombian law.
                </p>
              ) : (
                <p>
                  Nuestro sitio puede contener enlaces a páginas externas. No somos responsables por sus políticas de privacidad ni por el manejo de datos en dichos sitios.
                </p>
              )}
            </div>

            {/* Section 10 — Changes to Policy */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "10. Changes to This Policy" : "10. Cambios en la política"}
              </h2>
              <p>
                {isEn
                  ? "We may update this policy periodically. We will notify you of significant changes through the website or by email if you are an active client."
                  : "Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Las actualizaciones serán publicadas en esta misma página."}
              </p>
            </div>

            {/* Section 11 — Contact */}
            <div>
              <h2 className="font-heading text-2xl text-brand-navy mb-3">
                {isEn ? "11. Contact" : "11. Contacto"}
              </h2>
              {isEn ? (
                <p>
                  For privacy inquiries:{" "}
                  <a href={`mailto:${contactEmail}`} className="text-brand-blue hover:underline">
                    {contactEmail}
                  </a>
                </p>
              ) : (
                <>
                  <p>Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, puedes contactarnos a través de:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1">
                    <li>
                      Correo electrónico:{" "}
                      <a href={`mailto:${contactEmail}`} className="text-brand-blue hover:underline">
                        {contactEmail}
                      </a>
                    </li>
                    <li>
                      Sitio web:{" "}
                      <a href="https://www.allurahealthcare.com/" className="text-brand-blue hover:underline" target="_blank" rel="noopener noreferrer">
                        https://www.allurahealthcare.com/
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Section 12 — Applicable Law (ES only) */}
            {!isEn && (
              <div>
                <h2 className="font-heading text-2xl text-brand-navy mb-3">12. Legislación aplicable</h2>
                <p>Esta política se rige por las leyes de la República de Colombia, en especial:</p>
                <ul className="list-disc pl-6 mt-3 space-y-1">
                  <li>Ley 1581 de 2012 (Protección de Datos Personales)</li>
                  <li>Decreto 1377 de 2013</li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
