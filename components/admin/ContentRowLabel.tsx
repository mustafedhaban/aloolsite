'use client'

import { useRowLabel } from '@payloadcms/ui'

export function ContentRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; title?: string; value?: string; name?: string }>()
  const label = data?.label || data?.title || data?.name || `Text block ${(rowNumber ?? 0) + 1}`
  return <span className="alool-content-row"><strong>{label}</strong>{data?.value && data.value !== label && <span>{data.value}</span>}</span>
}
