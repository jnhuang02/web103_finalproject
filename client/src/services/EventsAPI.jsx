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


export async function fetchEventById(id) {
const res = await fetch(`${API}/events/${id}`)
if (!res.ok) throw new Error('Event not found')
return res.json()
}


export async function reserveTickets(id, data) {
const res = await fetch(`${API}/events/${id}/reservations`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
})
if (!res.ok) {
const err = await res.json().catch(() => ({}))
const message = err.error || 'Failed to reserve tickets'
const info = err.tickets_remaining != null ? { tickets_remaining: err.tickets_remaining } : {}
const error = new Error(message)
Object.assign(error, info)
throw error
}
return res.json()
}