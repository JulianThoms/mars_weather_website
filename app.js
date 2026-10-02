"use strict";

const path = require("path");
const express = require("express");
const { getWeather } = require("./weather");
const { temperatureChart, windRose } = require("./charts");

const PORT = process.env.PORT || 4000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Static assets (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const unit = req.query.unit === "f" ? "f" : "c";
  const convert = unit === "f" ? (c) => c * 9 / 5 + 32 : (c) => c;

  let weather;
  try {
    weather = await getWeather();
  } catch (err) {
    console.error("Failed to fetch Mars weather:", err);
    return res.status(502).render("error", {
      message: "NASA's weather service didn't answer. Try again in a few minutes."
    });
  }

  const sols = weather.sols;
  const selected = sols.find((s) => s.sol === Number(req.query.sol)) || sols[sols.length - 1];

  res.render("index", {
    sols,
    selected,
    unit,
    fetchedAt: weather.fetchedAt,
    tempChart: temperatureChart(sols, convert),
    rose: windRose(selected.windDirections),
    prevailing: [...selected.windDirections].sort((a, b) => b.count - a.count)[0],
    temp: (c) => (c == null ? "–" : `${minus(Math.round(convert(c)))}°`),
    tick: (v) => minus(v),
    link: (params) => "?" + new URLSearchParams({ sol: selected.sol, unit, ...params }),
    date: (d) => (d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "–"),
    shortDate: (d) => (d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : ""),
    num: (n, digits = 0) => (n == null ? "–" : n.toFixed(digits))
  });
});

app.use((req, res) => {
  res.status(404).render("error", { message: "There's nothing at this address." });
});

// Proper minus sign instead of a hyphen, it lines up better next to the numbers
function minus(n) {
  return String(n).replace("-", "−");
}

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Mars Weather App listening on port ${PORT}`);
});
