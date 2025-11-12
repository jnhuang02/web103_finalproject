import express from 'express'
import { listAllEvents, listEventsByLocationSlug } from '../controllers/events.controller.js'


const router = express.Router()
router.get('/events', listAllEvents)
router.get('/locations/:slug/events', listEventsByLocationSlug)
export default router