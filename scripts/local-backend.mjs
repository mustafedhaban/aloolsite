import { mkdir, access, writeFile, chmod } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

// A dedicated project-local cluster: never connects to or modifies other databases.
const root = process.cwd()
const local = path.join(root, '.local')
const cluster = path.join(local, 'postgres')
const port = '55439'
await mkdir(local, { recursive: true, mode: 0o700 })
const exists = async (file) => access(file).then(() => true, () => false)
function run(command, args, optional = false) {
  const result = spawnSync(command, args, { stdio: 'pipe', encoding: 'utf8' })
  if (result.status !== 0 && !optional) throw new Error(`${command} failed: ${result.stderr || result.error || result.stdout}`)
  return result
}
if (process.argv[2] === 'stop') {
  run('pg_ctl', ['-D', cluster, 'stop', '-m', 'fast'])
  console.log('Stopped only the Alool project-local database.')
  process.exit(0)
}
if (!(await exists(path.join(cluster, 'PG_VERSION')))) {
  run('initdb', ['-D', cluster, '-U', 'alool_local', '--auth-local=trust', '--auth-host=trust', '--encoding=UTF8'])
}
if (run('pg_ctl', ['-D', cluster, 'status'], true).status !== 0) {
  run('pg_ctl', ['-D', cluster, '-l', path.join(local, 'postgres.log'), '-o', `-h 127.0.0.1 -p ${port} -k ${local}`, 'start', '-w'])
}
const connection = `postgresql://alool_local@127.0.0.1:${port}/alool_cms`
const check = run('psql', ['-h', '127.0.0.1', '-p', port, '-U', 'alool_local', '-d', 'postgres', '-tAc', "SELECT 1 FROM pg_database WHERE datname = 'alool_cms'"])
if (check.stdout.trim() !== '1') run('createdb', ['-h', '127.0.0.1', '-p', port, '-U', 'alool_local', 'alool_cms'])
const env = path.join(root, '.env.local')
if (!(await exists(env))) {
  await writeFile(env, `DATABASE_URL=${connection}\nPAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nNEXT_PUBLIC_SERVER_URL=http://localhost:4173\nCONTACT_ENABLED=false\n`, { flag: 'wx', mode: 0o600 })
  await chmod(env, 0o600)
  console.log('Created ignored local configuration with a random secret. Existing environment files are never overwritten.')
}
console.log('Alool database is ready on loopback port 55439. Local trust authentication is for development only.')
