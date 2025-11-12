import { Link } from 'react-router-dom'


export default function TeamCard({ team }){
return (
<Link to={`/locations/${team.slug}`} className="team-card" title={team.name}>
{team.logo_url && <img src={team.logo_url} alt={`${team.name} logo`} />}
<div className="meta">
<h3>{team.name}</h3>
<p>{team.city}, {team.state}</p>
<small>{team.stadium}</small>
</div>
</Link>
)
}