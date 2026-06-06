'use client'
import { HeroForm } from './section-forms/HeroForm'
import { BenefitsForm } from './section-forms/BenefitsForm'
import { ServicesGridForm } from './section-forms/ServicesGridForm'
import { AboutTeaserForm } from './section-forms/AboutTeaserForm'
import { MedellinForm } from './section-forms/MedellinForm'
import { TeamPreviewForm } from './section-forms/TeamPreviewForm'
import { TeamGridForm } from './section-forms/TeamGridForm'
import { ProcessForm } from './section-forms/ProcessForm'
import { CtaForm } from './section-forms/CtaForm'
import { TestimonialsForm } from './section-forms/TestimonialsForm'
import { FaqForm } from './section-forms/FaqForm'
import { ContactFormSectionForm } from './section-forms/ContactFormSectionForm'
import { TextImageForm } from './section-forms/TextImageForm'
import { CustomSectionForm } from './section-forms/CustomSectionForm'
import { CardsGridForm } from './section-forms/CardsGridForm'
import { CustomFormSectionForm } from './section-forms/CustomFormSectionForm'
import { PageHeaderForm } from './section-forms/PageHeaderForm'
import { SocialLinksForm } from './section-forms/SocialLinksForm'

interface SectionFormRouterProps {
  type: string
  settings: Record<string, unknown>
  onChange: (settings: Record<string, unknown>) => void
}

export function SectionFormRouter({ type, settings, onChange }: SectionFormRouterProps) {
  const props = { settings, onChange }
  switch (type) {
    case 'hero': return <HeroForm {...props} />
    case 'benefits': return <BenefitsForm {...props} />
    case 'services_grid': return <ServicesGridForm {...props} />
    case 'about_teaser': return <AboutTeaserForm {...props} />
    case 'medellin': return <MedellinForm {...props} />
    case 'team_preview': return <TeamPreviewForm {...props} />
    case 'team_grid':    return <TeamGridForm {...props} />
    case 'process': return <ProcessForm {...props} />
    case 'cta': return <CtaForm {...props} />
    case 'testimonials': return <TestimonialsForm {...props} />
    case 'faq': return <FaqForm {...props} />
    case 'contact_form': return <ContactFormSectionForm {...props} />
    case 'text_image': return <TextImageForm {...props} />
    case 'cards_grid':  return <CardsGridForm {...props} />
    case 'custom_form':  return <CustomFormSectionForm {...props} />
    case 'page_header':   return <PageHeaderForm {...props} />
    case 'social_links':  return <SocialLinksForm {...props} />
    case 'custom': return <CustomSectionForm {...props} />
    default: return <p className="text-sm text-gray-400 italic">Tipo no reconocido: {type}</p>
  }
}
