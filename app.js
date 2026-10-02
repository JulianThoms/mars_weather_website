"use strict";

const path = require("path");
const express = require("express");

const PORT = 4000;
// Personal key from https://api.nasa.gov; falls back to NASA's public, rate-limited DEMO_KEY
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const INSIGHT_WEATHER_URL = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Static assets (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (_req, res) => {
  try {
    const response = await fetch(INSIGHT_WEATHER_URL);
    if (!response.ok) {
      throw new Error(`NASA API responded with ${response.status}`);
    }
    const weather = await response.json();
    console.log(weather);
  } catch (err) {
    console.error("Failed to fetch Mars weather:", err);
  }

  res.render("index");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Mars Weather App listening on port ${PORT}`);
});
