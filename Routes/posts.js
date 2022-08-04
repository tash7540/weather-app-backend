import express from 'express';
import {citySearch,citySearchForecast} from '../Controllers/posts.js';

const router = express.Router();

router.post('/currentWeather', citySearch);
router.get('/forecastWeather', citySearchForecast);
export default router;
