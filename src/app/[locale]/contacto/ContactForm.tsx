"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const WHATSAPP_URL =
  "https://wa.me/17862087572?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Allura%20Healthcare";

export function ContactForm() {
  const t = useTranslations("contacto");

  const schema = z.object({
    nombre:   z.string().min(2, t("validNombre")),
    email:    z.string().email(t("validEmail")),
    telefono: z.string().min(7, t("validTelefono")),
    servicio: z.enum(["full-mouth-reconstruction", "smile-makeover", "aligners", "facial-harmony", "otro"], {
      required_error: t("validServicio"),
    }),
    mensaje:  z.string().min(10, t("validMensaje")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log(data);
    reset();
  };

  const inputClass =
    "w-full font-body text-sm text-brand-navy bg-brand-light border border-brand-blue/20 rounded-xl px-4 py-3 placeholder:text-brand-silver focus:outline-none focus:border-brand-blue transition-colors";

  return (
    <section className="section-padding bg-white">
      <div className="container-allura grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          {isSubmitSuccessful ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-navy/5 flex items-center justify-center mb-5">
                <Mail size={28} className="text-brand-navy" />
              </div>
              <h3 className="font-heading text-2xl text-brand-navy mb-2">{t("successTitle")}</h3>
              <p className="font-body text-brand-silver text-sm">
                {t("successBody")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input {...register("nombre")} placeholder={t("formNombre")} className={inputClass} />
                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
              </div>
              <div>
                <input {...register("email")} type="email" placeholder={t("formEmail")} className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <input {...register("telefono")} placeholder={t("formTelefono")} className={inputClass} />
                {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
              </div>
              <div>
                <select {...register("servicio")} className={inputClass}>
                  <option value="">{t("servicioOpciones.placeholder")}</option>
                  <option value="full-mouth-reconstruction">{t("servicioOpciones.fullMouth")}</option>
                  <option value="smile-makeover">{t("servicioOpciones.smileMakeover")}</option>
                  <option value="aligners">{t("servicioOpciones.aligners")}</option>
                  <option value="facial-harmony">{t("servicioOpciones.facialHarmony")}</option>
                  <option value="otro">{t("servicioOpciones.otro")}</option>
                </select>
                {errors.servicio && <p className="mt-1 text-xs text-red-500">{errors.servicio.message}</p>}
              </div>
              <div>
                <textarea
                  {...register("mensaje")}
                  rows={5}
                  placeholder={t("formMensaje")}
                  className={`${inputClass} resize-none`}
                />
                {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>}
              </div>
              <Button type="submit" variant="primary" className="w-full">
                {isSubmitting ? t("formSubmitting") : t("formSubmit")}
              </Button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-blue mb-6">
              {t("infoLabel")}
            </p>
            <ul className="space-y-5">
              {[
                { icon: MapPin,         label: t("infoLocation") },
                { icon: Mail,           label: "contact@allurahealthcare.com" },
                { icon: MessageCircle,  label: t("infoWhatsapp") },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-navy" />
                  </div>
                  <p className="font-body text-sm text-brand-silver pt-2">{label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp direct */}
          <div className="rounded-2xl bg-brand-light p-6">
            <p className="font-heading text-lg text-brand-navy mb-2">{t("waTitle")}</p>
            <p className="font-body text-sm text-brand-silver mb-5">
              {t("waBody")}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body font-bold text-sm hover:bg-[#22c55e] transition-colors"
            >
              <MessageCircle size={16} />
              {t("waCta")}
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden aspect-video bg-brand-light">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2d-75.5636!3d6.2442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb5c17b!2sMedell%C3%ADn%2C+Antioquia!5e0!3m2!1ses!2sco!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
