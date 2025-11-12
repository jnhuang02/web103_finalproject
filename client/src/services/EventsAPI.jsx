const API = import.meta.env.VITE_API_BASE


export async function fetchAllEvents(params = {}) {
const usp = new URLSearchParams(params)
const res = await fetch(`${API}/events?${usp.toString()}`)
if (!res.ok) throw new Error('Failed to fetch events')
return res.json()
}


export async function fetchEventsByLocation(slug) {
const res = await fetch(`${API}/locations/${slug}/events`)
if (!res.ok) throw new Error('Failed to fetch events for location')
return res.json()
}