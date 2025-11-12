import { pool } from '../config/database.js'


export async function listLocations(req, res) {
try {
const { rows } = await pool.query('SELECT * FROM locations ORDER BY name')
res.json(rows)
} catch (e) { res.status(500).json({ error: e.message }) }
}


export async function getLocationBySlug(req, res) {
try {
const { slug } = req.params
const { rows } = await pool.query('SELECT * FROM locations WHERE slug = $1', [slug])
if (!rows[0]) return res.status(404).json({ error: 'Location not found' })
res.json(rows[0])
} catch (e) { res.status(500).json({ error: e.message }) }
}