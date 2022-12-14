import express from 'express';
import {citySearch,citySearchForecast,citySearchHistorical} from '../Controllers/posts.js';

const router = express.Router();

router.post('/currentWeather', citySearch);
router.post('/forecastWeather', citySearchForecast);
router.post('/HistoricalWeather', citySearchHistorical);
export default router;
