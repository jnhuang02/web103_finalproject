
import pg from 'pg'
import dotenv from 'dotenv'

// Ensure environment variables from server/.env are loaded when scripts run
dotenv.config()

const isRender = (process.env.PGHOST || '').includes('render.com')
const ssl =
  process.env.PGSSL === 'true' || isRender
    ? { rejectUnauthorized: false }   // Render requires SSL
    : false                            // Local Postgres usually has no SSL

export const pool = new pg.Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  ssl,
})
