import { pool } from '../config/database.js'


export async function listAllEvents(req, res) {
try {
const { q, location } = req.query
const params = []
let where = []
if (q) { params.push(`%${q}%`); where.push('(e.title ILIKE $' + params.length + ' OR e.description ILIKE $' + params.length + ')') }
if (location) { params.push(location); where.push('l.slug = $' + params.length) }


const sql = `
SELECT e.*, l.name as location_name, l.slug as location_slug, l.logo_url
FROM events e
JOIN locations l ON l.id = e.location_id
${where.length ? 'WHERE ' + where.join(' AND ') : ''}
ORDER BY e.starts_at ASC`


const { rows } = await pool.query(sql, params)
res.json(rows)
} catch (e) { res.status(500).json({ error: e.message }) }
}


export async function listEventsByLocationSlug(req, res) {
try {
const { slug } = req.params
const { rows } = await pool.query(`
SELECT e.*, l.name as location_name, l.slug as location_slug, l.logo_url
FROM events e
JOIN locations l ON l.id = e.location_id
WHERE l.slug = $1
ORDER BY e.starts_at ASC
`, [slug])
res.json(rows)
} catch (e) { res.status(500).json({ error: e.message }) }
}