import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchEventById } from '../services/EventsAPI'


export default function EventOverview(){
const { id } = useParams()
const [event, setEvent] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


useEffect(() => {
fetchEventById(id)
.then(data => { setEvent(data); setError('') })
.catch(err => setError(err.message))
.finally(() => setLoading(false))
}, [id])


if (loading) return <p>Loading event…</p>
if (error) return <p className="error">{error}</p>
if (!event) return <p>Event not found</p>


const start = new Date(event.starts_at)
const soldOut = typeof event.tickets_remaining === 'number' && event.tickets_remaining <= 0


return (
<section className="event-overview">
<Link to={-1} className="back-link">← Back</Link>

<header className="event-overview__header">
{event.logo_url && <img src={event.logo_url} alt={`${event.location_name} logo`} />}
<div>
<h2>{event.title}</h2>
<p>{event.location_name} • {start.toLocaleString()}</p>
<p>{event.location_city}, {event.location_state}</p>
<p>{event.location_stadium}</p>
</div>
</header>

<article className="event-overview__body">
{event.description && <p>{event.description}</p>}
<p className={`tickets ${soldOut ? 'sold-out' : ''}`}>
{soldOut ? 'Sold out' : `${event.tickets_remaining} tickets remaining`}
</p>
</article>

<footer className="event-overview__actions">
{event.url ? (
<a className={`btn ${soldOut ? 'disabled' : ''}`} href={event.url} target="_blank" rel="noreferrer">
{soldOut ? 'Join Waitlist' : 'Reserve Tickets'}
</a>
) : (
<button className="btn disabled" disabled>Reservations Unavailable</button>
)}
</footer>
</section>
)
}

