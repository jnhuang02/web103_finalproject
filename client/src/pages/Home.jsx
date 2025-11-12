import { useEffect, useState } from 'react'
import { fetchLocations } from '../services/LocationsAPI'
import TeamCard from '../components/TeamCard'


export default function Home(){
const [teams, setTeams] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


useEffect(() => {
fetchLocations().then(setTeams).catch(e => setError(e.message)).finally(()=>setLoading(false))
}, [])


if (loading) return <p>Loading teams…</p>
if (error) return <p className="error">{error}</p>


return (
<div className="grid">
{teams.map(t => <TeamCard key={t.slug} team={t} />)}
</div>
)
}