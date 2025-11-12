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


export async function getEventById(req, res) {
try {
const { id } = req.params
const { rows } = await pool.query(`
SELECT e.*, l.name as location_name, l.slug as location_slug, l.city as location_city, l.state as location_state, l.stadium as location_stadium, l.logo_url
FROM events e
JOIN locations l ON l.id = e.location_id
WHERE e.id = $1
`, [id])
if (!rows[0]) return res.status(404).json({ error: 'Event not found' })
res.json(rows[0])
} catch (e) { res.status(500).json({ error: e.message }) }
}


export async function reserveTickets(req, res) {
const client = await pool.connect()
try {
const { id } = req.params
const quantity = Number.parseInt(req.body?.quantity ?? 1, 10)
if (!Number.isInteger(quantity) || quantity <= 0) {
return res.status(400).json({ error: 'Quantity must be a positive integer' })
}

await client.query('BEGIN')
const { rows } = await client.query('SELECT tickets_remaining FROM events WHERE id = $1 FOR UPDATE', [id])
if (!rows[0]) {
await client.query('ROLLBACK')
return res.status(404).json({ error: 'Event not found' })
}

const remaining = Number(rows[0].tickets_remaining ?? 0)
if (remaining < quantity) {
await client.query('ROLLBACK')
return res.status(400).json({ error: 'Not enough tickets remaining', tickets_remaining: remaining })
}

await client.query('UPDATE events SET tickets_remaining = tickets_remaining - $1 WHERE id = $2', [quantity, id])
const updated = await client.query(`
SELECT e.*, l.name as location_name, l.slug as location_slug, l.city as location_city, l.state as location_state, l.stadium as location_stadium, l.logo_url
FROM events e
JOIN locations l ON l.id = e.location_id
WHERE e.id = $1
`, [id])

await client.query('COMMIT')
res.json({ event: updated.rows[0] })
} catch (e) {
await client.query('ROLLBACK')
res.status(500).json({ error: e.message })
} finally {
client.release()
}
}