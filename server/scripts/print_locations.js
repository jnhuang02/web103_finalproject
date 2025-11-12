import { pool } from '../config/database.js'

async function printLocations() {
  try {
    const { rows } = await pool.query('SELECT * FROM locations ORDER BY name')
    console.log(JSON.stringify(rows, null, 2))
  } catch (err) {
    console.error('Error querying locations:', err.message)
  } finally {
    await pool.end()
  }
}

printLocations()
