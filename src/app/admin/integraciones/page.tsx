import { getAllIntegrations } from '@/lib/integrations'
import { IntegracionesEditor } from './IntegracionesEditor'

export const dynamic = 'force-dynamic'

export default async function IntegracionesPage() {
  const integrations = await getAllIntegrations()
  return <IntegracionesEditor initial={integrations} />
}
