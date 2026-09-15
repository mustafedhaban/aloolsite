import config from '@payload-config'
import './admin/layer-order.css'
import '@payloadcms/next/css'
import './admin/alool-admin.scss'
import './admin/shadcn.css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap'
export const viewport = { width: 'device-width', initialScale: 1 }
export const metadata = { robots: { index: false, follow: false } }
const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}
export default function Layout({children}:{children:React.ReactNode}) {
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>
}
