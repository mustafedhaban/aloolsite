import type { Field } from 'payload'

export function fieldsFrom(sample: Record<string, unknown>): Field[] {
  return Object.entries(sample).map(([name, value]): Field => {
    const label = name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
    if (Array.isArray(value)) {
      const item = value[0]
      return { name, label, type: 'array', fields: typeof item === 'string' ? [{ name: 'value', type: 'textarea', required: true }] : fieldsFrom((item || {}) as Record<string, unknown>) }
    }
    if (value && typeof value === 'object') return { name, label, type: 'group', fields: fieldsFrom(value as Record<string, unknown>) }
    if(typeof value === 'string' && value.length > 120)return { name, label, type: 'textarea', required: true }
    return { name, label, type: 'text', required: true }
  })
}

export function encode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(x => typeof x === 'string' ? { value: x } : encode(x))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, encode(v)]))
  return value
}

export function decode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(x => x && typeof x === 'object' && 'value' in x && Object.keys(x).every(k=>['value','id'].includes(k)) ? x.value : decode(x))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, decode(v)]))
  return value
}
