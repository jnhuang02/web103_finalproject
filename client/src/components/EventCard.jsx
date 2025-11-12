import { Link } from 'react-router-dom'
import Countdown from './Countdown'


export default function EventCard({ e }){
const start = new Date(e.starts_at)
const past = start.getTime() < Date.now()
return (
<article className={`event-card ${past ? 'past' : ''}`}>
<Link to={`/events/${e.id}`} className="event-card__link" aria-label={`View details for ${e.title}`}>
<header>
{e.logo_url && <img src={e.logo_url} alt={`${e.location_name} logo`} />}
<div>
<h4>{e.title}</h4>
<small>{e.location_name} • {start.toLocaleString()}</small>
</div>
</header>
{e.description && <p>{e.description}</p>}
</Link>
<footer>
{!past ? <Countdown to={e.starts_at} /> : <span className="past-text">Event passed</span>}
<Link className="btn secondary" to={`/events/${e.id}`}>View</Link>
</footer>
</article>
)
}