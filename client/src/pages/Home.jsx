import { useEffect, useState } from 'react'
import { fetchLocations } from '../services/LocationsAPI'
import { fetchAllEvents } from '../services/EventsAPI'
import TeamCard from '../components/TeamCard'
import EventCard from '../components/EventCard'
import Spinner from '../components/Spinner'


export default function Home(){
const [teams, setTeams] = useState([])
const [events, setEvents] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


useEffect(() => {
async function load(){
try {
const [locs, evs] = await Promise.all([fetchLocations(), fetchAllEvents()])
setTeams(locs)
setEvents(evs.slice(0, 4))
setError('')
} catch (e) {
setError(e.message)
} finally {
setLoading(false)
}
}
load()
}, [])


if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}><Spinner size="large" /></div>
if (error) return <p className="error">{error}</p>


return (
<div className="home">
<section className="home__locations">
<h2>Explore Locations</h2>
<div className="grid">
{teams.map(t => <TeamCard key={t.slug} team={t} />)}
</div>
</section>

<section className="home__events">
<h2>Upcoming Events</h2>
{events.length === 0 ? (
<p>No upcoming events yet.</p>
) : (
<div className="events">
{events.map(e => <EventCard key={e.id} e={e} />)}
</div>
)}
</section>
</div>
)
}