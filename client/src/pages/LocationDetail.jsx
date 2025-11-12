import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchLocation } from '../services/LocationsAPI'
import { fetchEventsByLocation } from '../services/EventsAPI'
import EventCard from '../components/EventCard'


export default function LocationDetail(){
const { slug } = useParams()
const [location, setLocation] = useState(null)
const [events, setEvents] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
async function load(){
const loc = await fetchLocation(slug)
setLocation(loc)
const evs = await fetchEventsByLocation(slug)
setEvents(evs)
setLoading(false)
}
load().catch(console.error)
}, [slug])


if (loading) return <p>Loading…</p>
if (!location) return <p>Not found</p>


return (
<div>
<Link to="/">← Back</Link>
<header className="location-header">
{location.logo_url && <img src={location.logo_url} alt={`${location.name} logo`} />}
<div>
<h2>{location.name}</h2>
<p>{location.stadium} • {location.city}, {location.state}</p>
</div>
</header>


{events.length === 0 ? (
<p>No events yet.</p>
) : (
<div className="events">
{events.map(e => <EventCard key={e.id} e={e} />)}
</div>
)}
</div>
)
}