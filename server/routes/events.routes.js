import express from 'express'
import { listAllEvents, listEventsByLocationSlug, getEventById, reserveTickets } from '../controllers/events.controller.js'


const router = express.Router()
router.get('/events', listAllEvents)
router.get('/events/:id', getEventById)
router.get('/locations/:slug/events', listEventsByLocationSlug)
router.post('/events/:id/reservations', reserveTickets)
export default router