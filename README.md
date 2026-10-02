# mars_weather_website
A website showing the weather on Mars, built to learn more complex API calls and server-side programming with Node.js.

It uses NASA's InSight Mars Weather Service API. InSight stopped sending data in December 2022, so the API (and this site) only shows the last seven sols it received.

## Features
- High, low and average temperature, pressure, wind and season for each sol
- Temperature chart for the last seven sols, click a bar to pick a sol
- Wind rose showing the wind direction readings for that sol
- Table with all sols
- Switch between °C and °F
- Caches NASA's response for an hour, so the API's rate limit isn't hit on every page load

## Running it
You need [Node.js](https://nodejs.org/) 18 or newer.

```sh
npm install
npm start
```

Then open http://localhost:4000.

### NASA API key
Without a key the server uses NASA's public `DEMO_KEY`, which only allows 10 requests per hour. Since responses are cached for an hour that's usually enough, but you can get your own free key at https://api.nasa.gov and pass it in as an environment variable:

```sh
# macOS / Linux / Git Bash
NASA_API_KEY=your-key npm start

# Windows PowerShell
$env:NASA_API_KEY="your-key"; npm start
```

Don't commit your key to the repository.

### Port
The server runs on port 4000 by default. Set `PORT` to use a different one, e.g. `PORT=8080 npm start`.
