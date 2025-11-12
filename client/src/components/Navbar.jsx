import { Link } from 'react-router-dom'


export default function Navbar(){
return (
<nav className="nav">
<div className="container">
<h1 className="title"><Link to="/">NFL Community Space</Link></h1>
<div className="links">
<Link to="/events">All Events</Link>
</div>
</div>
</nav>
)
}