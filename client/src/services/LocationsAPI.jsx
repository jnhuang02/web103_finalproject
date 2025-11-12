const API = import.meta.env.VITE_API_BASE


export async function fetchLocations() {
const res = await fetch(`${API}/locations`)
if (!res.ok) throw new Error('Failed to fetch locations')
return res.json()
}


export async function fetchLocation(slug) {
const res = await fetch(`${API}/locations/${slug}`)
if (!res.ok) throw new Error('Location not found')
return res.json()
}