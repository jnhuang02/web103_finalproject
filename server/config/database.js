import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const isRender = (process.env.PGHOST || '').includes('render.com')
const ssl = process.env.PGSSL === 'true' || isRender
  ? { rejectUnauthorized: false }
  : false

// Coerce env vars to strings and trim hidden quotes/BOM
const clean = v => v == null ? undefined : String(v).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')

export const pool = new pg.Pool({
  user: clean(process.env.PGUSER),
  password: clean(process.env.PGPASSWORD),
  host: clean(process.env.PGHOST),
  port: Number(clean(process.env.PGPORT || 5432)),
  database: clean(process.env.PGDATABASE),
  ssl,
})
