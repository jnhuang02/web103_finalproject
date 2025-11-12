import { useEffect, useMemo, useState } from 'react'
import { fetchAllEvents } from '../services/EventsAPI'
import EventCard from '../components/EventCard'


export default function AllEvents(){
const [events, setEvents] = useState([])
const [q, setQ] = useState('')
const [location, setLocation] = useState('')


useEffect(() => {
fetchAllEvents({ q, location }).then(setEvents).catch(console.error)
}, [q, location])


// unique location slugs for filter dropdown
const locations = useMemo(() => Array.from(new Set(events.map(e => e.location_slug))), [events])


return (
<section className="events-page">
<header className="events-page__header">
<div>
<h1>Discover Events</h1>
<p className="events-page__subtitle">Browse upcoming experiences across every venue. Filter by location or search to find something that inspires you.</p>
</div>
</header>

<div className="filters">
<div className="field">
<label htmlFor="event-search">Search</label>
<input id="event-search" placeholder="Search title or description…" value={q} onChange={e=>setQ(e.target.value)} />
</div>
<div className="field">
<label htmlFor="event-location">Location</label>
<select id="event-location" value={location} onChange={e=>setLocation(e.target.value)}>
<option value="">All Locations</option>
{locations.map(s => <option key={s} value={s}>{s}</option>)}
</select>
</div>
</div>


{events.length === 0 ? (
<div className="events-page__empty">
<h3>No events match your filters</h3>
<p>Try adjusting your search or check back soon for new announcements.</p>
</div>
) : (
<div className="events">
{events.map(e => <EventCard key={e.id} e={e} />)}
</div>
)}
</section>
)
}