import { useEffect, useState } from 'react'


export default function Countdown({ to }){
const [delta, setDelta] = useState(() => new Date(to) - new Date())
useEffect(() => {
const id = setInterval(() => setDelta(new Date(to) - new Date()), 1000)
return () => clearInterval(id)
}, [to])


if (delta <= 0) return <span className="past">Started</span>


const total = Math.floor(delta / 1000)
const days = Math.floor(total / 86400)
const hours = Math.floor((total % 86400) / 3600)
const minutes = Math.floor((total % 3600) / 60)
const seconds = total % 60


return <span>{days}d {hours}h {minutes}m {seconds}s</span>
}