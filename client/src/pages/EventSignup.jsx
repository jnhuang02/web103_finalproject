import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchEventById, reserveTickets } from '../services/EventsAPI'
import Spinner from '../components/Spinner'


export default function EventSignup(){
const { id } = useParams()
const navigate = useNavigate()
const [event, setEvent] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [tickets, setTickets] = useState(1)
const [notes, setNotes] = useState('')
const [submitted, setSubmitted] = useState(false)
const [submitting, setSubmitting] = useState(false)
const [formError, setFormError] = useState('')


useEffect(() => {
fetchEventById(id)
.then(data => { setEvent(data); setError('') })
.catch(err => setError(err.message))
.finally(() => setLoading(false))
}, [id])


const capacityLeft = useMemo(() => {
if (!event || typeof event.tickets_remaining !== 'number') return null
return Math.max(event.tickets_remaining, 0)
}, [event])


useEffect(() => {
if (capacityLeft != null && tickets > capacityLeft) {
setTickets(capacityLeft || 1)
}
}, [capacityLeft, tickets])


if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}><Spinner size="large" /></div>
if (error) return <p className="error">{error}</p>
if (!event) return <p>Event not found</p>


const start = new Date(event.starts_at)
const end = event.ends_at ? new Date(event.ends_at) : null
const soldOut = capacityLeft === 0


function increment(delta){
setTickets(q => {
const max = capacityLeft ?? 12
const next = Math.min(Math.max(q + delta, 1), max || 1)
return next
})
}


function handleSubmit(e){
e.preventDefault()
if (soldOut || submitting) return
setSubmitting(true)
setFormError('')
reserveTickets(event.id, { quantity: tickets, name, email, notes })
.then(({ event: updated }) => {
setEvent(updated)
setSubmitted(true)
setTickets(1)
setTimeout(() => navigate(`/events/${updated.id}`), 1800)
})
.catch(err => {
setFormError(err.message)
if (err.tickets_remaining != null) {
setEvent(prev => prev ? { ...prev, tickets_remaining: err.tickets_remaining } : prev)
}
})
.finally(() => setSubmitting(false))
}


return (
<section className="signup-page">
<div className="signup-page__crumbs">
<Link to={`/events/${event.id}`} className="back-link">← Back to overview</Link>
</div>

<div className="signup-layout">
<article className="signup-summary">
<header>
{event.logo_url && <img src={event.logo_url} alt={`${event.location_name} logo`} />}
<div>
<h2>{event.title}</h2>
<p>{event.location_name}</p>
<p>{start.toLocaleString()}</p>
{end && <p>Ends {end.toLocaleString()}</p>}
<p className="signup-summary__meta">{event.location_city}, {event.location_state} • {event.location_stadium}</p>
</div>
</header>
{event.description && <p>{event.description}</p>}
<div className="signup-summary__tags">
<span className="chip">{event.category || 'General'}</span>
{soldOut ? (
<span className="chip chip--soldout">Sold out</span>
) : capacityLeft != null ? (
<span className="chip chip--alert">🔥 {capacityLeft} tickets left</span>
) : null}
</div>
</article>


<form className="signup-card" onSubmit={handleSubmit}>
<h3>Reserve your spot</h3>
<div className="field">
<label htmlFor="signup-name">Full name</label>
<input id="signup-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" required />
</div>
<div className="field">
<label htmlFor="signup-email">Email</label>
<input id="signup-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@example.com" required />
</div>
<div className="field">
<label>Tickets</label>
<div className="ticket-selector">
<button type="button" onClick={()=>increment(-1)} disabled={tickets <= 1 || soldOut}>−</button>
<span>{soldOut ? 0 : tickets}</span>
<button type="button" onClick={()=>increment(1)} disabled={soldOut || (capacityLeft != null && tickets >= capacityLeft)}>+</button>
</div>
{capacityLeft != null && <small className="field__hint">{soldOut ? 'No tickets remaining' : `${capacityLeft} available`}</small>}
</div>

<div className="field">
<label htmlFor="signup-notes">Notes (optional)</label>
<textarea id="signup-notes" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Let the organizer know anything important…" />
</div>

<button className="btn btn--primary" type="submit" disabled={soldOut || submitted || submitting}>
{soldOut ? 'Sold out' : submitted ? 'Reserved!' : submitting ? 'Reserving…' : 'Reserve tickets'}
</button>
{formError && <p className="signup-error">{formError}</p>}
{submitted && <p className="signup-success">🎉 Reservation received! Redirecting…</p>}
</form>
</div>
</section>
)
}

