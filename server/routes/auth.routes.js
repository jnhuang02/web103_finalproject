import express from 'express'
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Verify Google ID token and return user info
router.post('/auth/verify', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ error: 'Token required' })
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      photo: payload.picture
    }

    res.json(user)
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
