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
<div>
<div className="filters">
<input placeholder="Search title/description…" value={q} onChange={e=>setQ(e.target.value)} />
<select value={location} onChange={e=>setLocation(e.target.value)}>
<option value="">All teams</option>
{locations.map(s => <option key={s} value={s}>{s}</option>)}
</select>
</div>


<div className="events">
{events.map(e => <EventCard key={e.id} e={e} />)}
</div>
</div>
)
}