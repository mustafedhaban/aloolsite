import type { ServerProps } from 'payload'
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { Badge } from './ui/badge'
import { buttonVariants } from './ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ChartAreaInteractive, type ActivityPoint } from './chart-area-interactive'
import { cn } from './ui/cn'

const adminPath = '/admin'

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function WeaveMark({ full = false }: { full?: boolean }) {
  // Many elements, one system: a field of parts with a single band drawn
  // through them. Three overlapping arcs merged into a blob below ~48px,
  // so the geometry is squares plus one band, which holds at 25px.
  const cells = [2, 9.5, 17]
  return (
    <svg
      aria-hidden="true"
      className={full ? 'alool-brand__mark alool-brand__mark--full' : 'alool-brand__mark'}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="alool-brand__cells">
        {cells.map((y) => cells.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" />))}
      </g>
      <path className="alool-brand__band" d="M3.5 20.5 20.5 3.5" />
    </svg>
  )
}

// The hero watermark renders at ~420px, where the lockup's three cells become
// slabs. Texture needs its own density, so it gets its own geometry.
function WeaveField() {
  const cells = Array.from({ length: 7 }, (_, i) => 2 + i * 8)
  return (
    <svg
      aria-hidden="true"
      className="alool-weave-field"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="alool-weave-field__cells">
        {cells.map((y) => cells.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" />))}
      </g>
      <g className="alool-weave-field__bands">
        <path d="M-4 44 44 -4" />
        <path d="M16 64 64 16" />
      </g>
    </svg>
  )
}

export function AloolIcon() {
  return (
    <span className="alool-brand alool-brand--icon" aria-label="Alool Technologies">
      <WeaveMark />
    </span>
  )
}

export function AloolLogo() {
  return (
    <span className="alool-brand alool-brand--logo" aria-label="Alool Technologies">
      <WeaveMark full />
      <span className="alool-brand__word">ALOOL</span>
      <span className="alool-brand__descriptor">Content workspace</span>
    </span>
  )
}

export function AdminNavFooter() {
  return (
    <div className="alool-nav-footer">
      <span className="alool-nav-footer__label">Public website</span>
      <a href="/" target="_blank" rel="noreferrer">
        View live site <Arrow />
      </a>
    </div>
  )
}

export function LoginIntro() {
  return (
    <div className="alool-login-intro">
      <p className="alool-kicker">ALOOL / CMS</p>
      <p>Manage the website with clarity. Preview changes before publishing.</p>
    </div>
  )
}

type Tracked = 'articles' | 'industries' | 'media' | 'pages' | 'projects' | 'services'

async function getCount(
  payload: ServerProps['payload'],
  collection: Tracked,
  user: ServerProps['user'],
  status?: 'draft' | 'published',
) {
  const result = await payload.count({
    collection,
    user,
    overrideAccess: false,
    ...(status ? { where: { _status: { equals: status } } } : {}),
  })
  return result.totalDocs
}

type RecentDoc = { id: string; title: string; collection: string; status: string; updatedAt: string }

/* The chart series is built from real document timestamps. Everything was
   seeded on one day, so it is sparse until editing starts — that is the
   honest picture, not a placeholder. */
function toSeries(docs: RecentDoc[], days: number): ActivityPoint[] {
  const buckets = new Map<string, { published: number; drafts: number }>()
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    buckets.set(d.toISOString().slice(0, 10), { published: 0, drafts: 0 })
  }
  for (const doc of docs) {
    const key = doc.updatedAt?.slice(0, 10)
    const bucket = key ? buckets.get(key) : undefined
    if (!bucket) continue
    if (doc.status === 'published') bucket.published += 1
    else bucket.drafts += 1
  }
  return [...buckets.entries()].map(([date, v]) => ({ date, ...v }))
}

export async function AdminDashboard({ payload, user }: ServerProps) {
  if (!user) return null
  const role = (user as { role?: string } | undefined)?.role
  const firstName = ((user as { name?: string } | undefined)?.name || '').trim().split(/\s+/)[0]

  const collections: { slug: Tracked; label: string }[] = [
    { slug: 'pages', label: 'Pages' },
    { slug: 'projects', label: 'Case studies' },
    { slug: 'services', label: 'Services' },
    { slug: 'industries', label: 'Industries' },
    { slug: 'articles', label: 'Insights' },
  ]

  const [pages, projects, services, media, publishedProjects, draftProjects, articles] =
    await Promise.all([
      getCount(payload, 'pages', user),
      getCount(payload, 'projects', user),
      getCount(payload, 'services', user),
      getCount(payload, 'media', user),
      getCount(payload, 'projects', user, 'published'),
      getCount(payload, 'projects', user, 'draft'),
      getCount(payload, 'articles', user),
    ])

  const recentByCollection = await Promise.all(
    collections.map(async ({ slug, label }) => {
      const result = await payload.find({
        collection: slug,
        user,
        overrideAccess: false,
        depth: 0,
        limit: 50,
        sort: '-updatedAt',
      })
      return result.docs.map((doc) => {
        const d = doc as unknown as { id: string; title?: string; _status?: string; updatedAt: string }
        return {
          id: `${slug}-${d.id}`,
          title: d.title || 'Untitled',
          collection: label,
          status: d._status || 'published',
          updatedAt: d.updatedAt,
        }
      })
    }),
  )
  const recent: RecentDoc[] = recentByCollection
    .flat()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const homepage = await payload.find({
    user,
    overrideAccess: false,
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { path: { equals: '/' } },
  })
  const homepageID = homepage.docs[0]?.id

  let newInquiries: number | null = null
  if (role === 'admin') {
    const result = await payload.count({
      user,
      overrideAccess: false,
      collection: 'inquiries',
      where: { status: { equals: 'new' } },
    })
    newInquiries = result.totalDocs
  }

  const cards = [
    {
      label: 'Website pages',
      value: pages,
      note: 'Copy entries inside approved layouts',
      trend: null as null | { up: boolean; text: string },
    },
    {
      label: 'Case studies',
      value: projects,
      note: `${publishedProjects} published · ${draftProjects} draft`,
      trend: draftProjects > 0 ? { up: false, text: `${draftProjects} unpublished` } : { up: true, text: 'All published' },
    },
    {
      label: 'Insights',
      value: articles,
      note: articles === 0 ? 'No articles published yet' : 'Published and draft articles',
      trend: null,
    },
    ...(newInquiries !== null
      ? [
          {
            label: 'New inquiries',
            value: newInquiries,
            note: newInquiries === 0 ? 'Nothing waiting for review' : 'Waiting in the inbox',
            trend: newInquiries > 0 ? { up: true, text: 'Needs review' } : null,
          },
        ]
      : []),
  ]

  const quickActions = [
    homepageID
      ? { label: 'Edit homepage', detail: `${pages} website pages`, href: `${adminPath}/collections/pages/${homepageID}` }
      : { label: 'Manage pages', detail: `${pages} website pages`, href: `${adminPath}/collections/pages` },
    { label: 'Review case studies', detail: `${publishedProjects} published · ${draftProjects} draft`, href: `${adminPath}/collections/projects` },
    { label: 'Manage services', detail: `${services} service entries`, href: `${adminPath}/collections/services` },
    { label: 'Add media', detail: media === 0 ? 'Library is empty' : `${media} assets in the library`, href: `${adminPath}/collections/media/create` },
  ]

  return (
    <div className="alool-dash @container/main flex flex-col gap-6 bg-background text-foreground">
      <header className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-(--accent)">
            {firstName ? `Welcome back, ${firstName}` : 'Alool / CMS'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Website workspace
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Update the public website, review representative work, and publish only what is ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className={cn(buttonVariants())} href="/" target="_blank" rel="noreferrer">
              View live website <Arrow />
            </a>
            <a className={cn(buttonVariants({ variant: 'outline' }))} href={`${adminPath}/collections/pages`}>
              All pages <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div
          className="pointer-events-none absolute -top-16 right-[4%] z-0 w-[min(34vw,380px)] rotate-[-8deg] text-(--accent) opacity-[0.14]"
          aria-hidden="true"
        >
          <WeaveField />
        </div>
      </header>

      <section aria-labelledby="workspace-status-title">
        <h2 id="workspace-status-title" className="sr-only">Workspace status</h2>
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/8 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {cards.map((card) => (
            <Card className="@container/card" key={card.label}>
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {card.value}
                </CardTitle>
                {card.trend && (
                  <CardAction>
                    <Badge variant="outline">
                      {card.trend.up ? <IconTrendingUp /> : <IconTrendingDown />}
                      {card.trend.text}
                    </Badge>
                  </CardAction>
                )}
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">{card.note}</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <ChartAreaInteractive data={toSeries(recent, 90)} />

      <section aria-labelledby="quick-actions-title">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-(--accent)">Start here</p>
            <h2 id="quick-actions-title" className="mt-1 text-lg font-semibold tracking-tight">Frequent tasks</h2>
          </div>
          <p className="text-xs text-muted-foreground">Shortcuts to the areas editors use most.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {quickActions.map((action, index) => (
            <a
              className="group rounded-lg border border-border bg-gradient-to-t from-primary/8 to-card p-5 shadow-xs no-underline transition-colors hover:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring)"
              href={action.href}
              key={action.href}
            >
              <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">0{index + 1}</span>
              <span className="mt-3 flex items-center justify-between gap-2">
                <strong className="text-sm font-semibold text-card-foreground">{action.label}</strong>
                <span aria-hidden="true" className="text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{action.detail}</span>
            </a>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recently updated</CardTitle>
          <CardDescription>The ten most recently edited documents across the CMS.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.slice(0, 10).map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.collection}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === 'published' ? 'default' : 'outline'}>
                      {doc.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {new Date(doc.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-(--accent)">Directory</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">All content areas</h2>
      </div>
    </div>
  )
}
