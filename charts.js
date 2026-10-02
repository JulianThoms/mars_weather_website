"use strict";

// Floating bars from the daily low to the daily high, one per sol
function temperatureChart(sols, convert) {
  const width = 640;
  const height = 260;
  const pad = { top: 16, right: 8, bottom: 44, left: 44 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const values = sols
    .filter((s) => s.temp)
    .flatMap((s) => [convert(s.temp.min), convert(s.temp.max)]);
  const step = niceStep(Math.max(...values) - Math.min(...values));
  const low = Math.floor(Math.min(...values) / step) * step;
  const high = Math.ceil(Math.max(...values) / step) * step;
  const y = (v) => pad.top + ((high - v) / (high - low)) * plotHeight;

  const ticks = [];
  for (let v = low; v <= high; v += step) {
    ticks.push({ value: v, y: y(v) });
  }

  const band = plotWidth / sols.length;
  const barWidth = Math.min(24, band - 8);
  const bars = sols.map((s, i) => {
    const center = pad.left + band * i + band / 2;
    const bar = { sol: s.sol, start: s.start, x: center - barWidth / 2, center, band, bandX: pad.left + band * i };
    if (s.temp) {
      bar.top = y(convert(s.temp.max));
      bar.height = y(convert(s.temp.min)) - bar.top;
      bar.avgY = y(convert(s.temp.avg));
    }
    return bar;
  });

  return { width, height, pad, ticks, bars, barWidth, plotBottom: pad.top + plotHeight };
}

// Aim for roughly five gridlines, whatever the unit
function niceStep(span) {
  return [10, 20, 25, 50, 100].find((s) => span / s <= 5) || 100;
}

// Wedges sized by how many wind readings fell on each of the 16 compass points
function windRose(directions) {
  const size = 240;
  const center = size / 2;
  const maxRadius = 92;
  const innerRadius = 10;
  const maxShare = Math.max(...directions.map((d) => d.share), 0);

  const point = (deg, r) => {
    const rad = (deg * Math.PI) / 180;
    return [center + r * Math.sin(rad), center - r * Math.cos(rad)];
  };

  const wedges = directions
    .filter((d) => d.count > 0)
    .map((d) => {
      // sqrt so the wedge area, not its length, matches the share
      const r = innerRadius + Math.sqrt(d.share / maxShare) * (maxRadius - innerRadius);
      const half = 11.25 - 1.5;
      const [x1, y1] = point(d.degrees - half, innerRadius);
      const [x2, y2] = point(d.degrees - half, r);
      const [x3, y3] = point(d.degrees + half, r);
      const [x4, y4] = point(d.degrees + half, innerRadius);
      const path = `M${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 0 1 ${x3} ${y3} ` +
        `L${x4} ${y4} A${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
      return { ...d, path };
    });

  const rings = [0.25, 0.5, 0.75, 1].map((f) => innerRadius + f * (maxRadius - innerRadius));
  const labels = [["N", 0], ["E", 90], ["S", 180], ["W", 270]].map(([text, deg]) => {
    const [x, y] = point(deg, maxRadius + 12);
    return { text, x, y };
  });

  return { size, center, rings, wedges, labels };
}

module.exports = { temperatureChart, windRose };
