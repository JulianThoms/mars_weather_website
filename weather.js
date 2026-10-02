"use strict";

// Personal key from https://api.nasa.gov; falls back to NASA's public, rate-limited DEMO_KEY
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const INSIGHT_WEATHER_URL = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;

// DEMO_KEY only allows 10 requests per hour, so don't ask NASA on every page load
const CACHE_TIME = 60 * 60 * 1000;
const RETRY_TIME = 5 * 60 * 1000;

const COMPASS_POINTS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

let cache = null;
let nextRefresh = 0;

async function getWeather() {
  if (cache && Date.now() < nextRefresh) {
    return cache;
  }

  try {
    cache = { sols: await fetchSols(), fetchedAt: new Date() };
    nextRefresh = Date.now() + CACHE_TIME;
  } catch (err) {
    if (!cache) throw err;
    console.error("Could not refresh Mars weather, using cached data:", err.message);
    nextRefresh = Date.now() + RETRY_TIME;
  }
  return cache;
}

async function fetchSols() {
  const response = await fetch(INSIGHT_WEATHER_URL);
  if (!response.ok) {
    throw new Error(`NASA API responded with ${response.status}`);
  }
  const data = await response.json();
  return data.sol_keys.map((key) => toSol(key, data[key]));
}

// NASA's field names are terse (AT, HWS, PRE, WD), turn them into something readable
function toSol(key, raw) {
  return {
    sol: Number(key),
    start: raw.First_UTC ? new Date(raw.First_UTC) : null,
    end: raw.Last_UTC ? new Date(raw.Last_UTC) : null,
    temp: range(raw.AT),
    pressure: range(raw.PRE),
    wind: range(raw.HWS),
    windDirections: windDirections(raw.WD),
    season: raw.Season,
    northernSeason: raw.Northern_season,
    southernSeason: raw.Southern_season,
    month: raw.Month_ordinal
  };
}

function range(sensor) {
  if (!sensor) return null;
  return { min: sensor.mn, avg: sensor.av, max: sensor.mx };
}

function windDirections(wd) {
  if (!wd) return [];

  const counts = new Map();
  for (const [key, reading] of Object.entries(wd)) {
    if (key !== "most_common") counts.set(reading.compass_point, reading.ct);
  }
  const total = [...counts.values()].reduce((sum, ct) => sum + ct, 0);

  return COMPASS_POINTS.map((point, i) => ({
    point,
    degrees: i * 22.5,
    count: counts.get(point) || 0,
    share: total ? (counts.get(point) || 0) / total : 0
  }));
}

module.exports = { getWeather };
