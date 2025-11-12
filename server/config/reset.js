import { pool } from './database.js'

async function reset() {
	// Drop existing tables then recreate schema
	await pool.query(`
		DROP TABLE IF EXISTS events;
		DROP TABLE IF EXISTS locations;

		CREATE TABLE locations (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			slug TEXT UNIQUE NOT NULL,
			city TEXT,
			state TEXT,
			stadium TEXT,
			lat NUMERIC,
			lng NUMERIC,
			logo_url TEXT
		);

		CREATE TABLE events (
			id SERIAL PRIMARY KEY,
			location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
			title TEXT NOT NULL,
			description TEXT,
			category TEXT,
			url TEXT,
			starts_at TIMESTAMPTZ NOT NULL,
			ends_at TIMESTAMPTZ
		);

		CREATE INDEX idx_events_location_id ON events(location_id);
		CREATE INDEX idx_events_starts_at ON events(starts_at);
	`)

	// Seed: 4+ NFL teams as locations
	const locations = [
		{ name: 'San Francisco 49ers', slug: '49ers', city: 'Santa Clara', state: 'CA', stadium: "Levi's Stadium", lat: 37.403, lng: -121.97, logo_url: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SF' },
		{ name: 'Seattle Seahawks', slug: 'seahawks', city: 'Seattle', state: 'WA', stadium: 'Lumen Field', lat: 47.5952, lng: -122.3316, logo_url: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SEA' },
		{ name: 'Kansas City Chiefs', slug: 'chiefs', city: 'Kansas City', state: 'MO', stadium: 'GEHA Field at Arrowhead', lat: 39.049, lng: -94.4839, logo_url: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/KC' },
		{ name: 'Dallas Cowboys', slug: 'cowboys', city: 'Arlington', state: 'TX', stadium: "AT&T Stadium", lat: 32.7473, lng: -97.0945, logo_url: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DAL' }
	]

	const locValues = locations.map(l => (
		[l.name, l.slug, l.city, l.state, l.stadium, l.lat, l.lng, l.logo_url]
	))

	const inserted = await pool.query(
		`INSERT INTO locations (name, slug, city, state, stadium, lat, lng, logo_url)
		 VALUES ${locValues.map((_, i) => `($${i*8+1}, $${i*8+2}, $${i*8+3}, $${i*8+4}, $${i*8+5}, $${i*8+6}, $${i*8+7}, $${i*8+8})`).join(',')}
		 RETURNING id, slug`,
		locValues.flat()
	)

	const bySlug = Object.fromEntries(inserted.rows.map(r => [r.slug, r.id]))

	// Helper for dates
	const now = new Date()
	const inDays = d => new Date(now.getTime() + d*24*60*60*1000)

	const events = [
		{ slug: '49ers', title: 'Tailgate & Tech Meetup', category: 'Meetup', description: 'Pre-game tailgate with analytics lightning talks.', url: 'https://example.com/49ers-tailgate', starts_at: inDays(5).toISOString(), ends_at: inDays(5).toISOString() },
		{ slug: '49ers', title: 'Stadium Tour', category: 'Tour', description: "Behind-the-scenes tour of Levi's Stadium.", url: 'https://example.com/49ers-tour', starts_at: inDays(-3).toISOString(), ends_at: inDays(-3).toISOString() },
		{ slug: 'seahawks', title: '12s Watch Party', category: 'Watch', description: 'Community watch party at Lumen Field concourse.', url: 'https://example.com/sea-watch', starts_at: inDays(2).toISOString(), ends_at: inDays(2).toISOString() },
		{ slug: 'chiefs', title: 'Arrowhead Food Fest', category: 'Festival', description: 'BBQ trucks + live music on the plaza.', url: 'https://example.com/kc-bbq', starts_at: inDays(10).toISOString(), ends_at: inDays(10).toISOString() },
		{ slug: 'cowboys', title: 'Youth Football Clinic', category: 'Clinic', description: 'Free drills and fundamentals with local coaches.', url: 'https://example.com/dal-clinic', starts_at: inDays(1).toISOString(), ends_at: inDays(1).toISOString() }
	]

	for (const e of events) {
		await pool.query(
			`INSERT INTO events (location_id, title, description, category, url, starts_at, ends_at)
			 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
			[bySlug[e.slug], e.title, e.description, e.category, e.url, e.starts_at, e.ends_at]
		)
	}

	console.log('✅ Database reset complete.')
	await pool.end()
}


reset().catch(err => { console.error(err); process.exit(1) })