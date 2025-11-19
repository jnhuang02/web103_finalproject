import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { verifyGoogleToken, getCurrentUser, logout } from '../services/AuthAPI'


export default function Navbar(){
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
const storedUser = getCurrentUser()
setUser(storedUser)
setLoading(false)
}, [])

const handleLogout = () => {
logout()
setUser(null)
}

const handleGoogleSuccess = async (credentialResponse) => {
try {
const userInfo = await verifyGoogleToken(credentialResponse.credential)
setUser(userInfo)
} catch (error) {
console.error('Login failed:', error)
}
}

const handleGoogleError = () => {
console.error('Google login failed')
}

return (
<nav className="nav">
<div className="container">
<h1 className="title"><Link to="/"> Eventful</Link></h1>
<div className="links">
<Link to="/events">All Events</Link>
{loading ? (
<span className="nav-loading">Loading…</span>
) : user ? (
<div className="nav-user">
{user.photo && <img src={user.photo} alt={user.name} className="nav-avatar" />}
<span className="nav-name">{user.name}</span>
<button onClick={handleLogout} className="btn btn--small">Logout</button>
</div>
) : (
<GoogleLogin
onSuccess={handleGoogleSuccess}
onError={handleGoogleError}
useOneTap={false}
/>
)}
</div>
</div>
</nav>
)
}