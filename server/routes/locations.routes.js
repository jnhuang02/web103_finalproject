import express from 'express'
import { listLocations, getLocationBySlug } from '../controllers/locations.controller.js'


const router = express.Router()
router.get('/locations', listLocations)
router.get('/locations/:slug', getLocationBySlug)
export default router