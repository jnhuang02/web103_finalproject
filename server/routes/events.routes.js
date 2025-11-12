import express from 'express'
import { listAllEvents, listEventsByLocationSlug, getEventById } from '../controllers/events.controller.js'


const router = express.Router()
router.get('/events', listAllEvents)
router.get('/events/:id', getEventById)
router.get('/locations/:slug/events', listEventsByLocationSlug)
export default router