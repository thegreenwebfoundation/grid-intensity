# Grid intensity polyfill

_A polyfill, to build awareness of carbon intensity into javascript programs - move your code through time and space for greener digital products._

The dream is for this to be built into the browser, so we learn as web makers to do the right thing by default, and incorporate carbon-aware practices into how we work. Partly inspired by the work by [Michelle Thorne and Yulia Startsev on Firefox Eco Mode concepts][1] and sustainablity engineering, and by [Lucia Ye's recent work on Onlign OS][2], and [David Sykes work on the energy onion model][3], and [Auke Hoekste's work on energy systems as ecosystems][4]

[1]: https://discourse.mozilla.org/t/firefox-eco-mode-brainstorming-how-can-the-internet-tackle-the-climate-emergency/46582/2
[2]: https://2020.rca.ac.uk/students/lu-ye/
[3]: https://medium.com/@david.sykes70/the-energy-onion-a-simple-conceptual-model-for-a-smart-system-3c1f2c5cbd1a
[4]: https://twitter.com/AukeHoekstra/status/1234071607724978176

## Usage

```js
import GridIntensity from '@tgwf/grid-intensity-polyfill'

// initialise
const grid = GridIntensity()

const carbonIndex = await grid.getCarbonIndex()

if (carbonIndex === 'low')  {
  // Huzzah! Energy is cheap! The wind is blowing and the sun is out,
  // the cost of energy is low, and the grid is also greener
  // than normal. Do network and CPU intensive stuff

  loadrichImages()

  await Promise.all([
    doExpensiveOperation(), preLoadVideo()
  ])

} else {
  // Eep - our grid is relying on more fossil fuels than usual, so
  // let's defer work til later, and serve a lighter weight experience
  // by default
  loadLiteImages()

  // if we have web workers available, let give them a job to do when
  // grid intensity is lower, so when the user comes back they have the
  // richer experience
  queueJobforWorker([
    doExpensiveOperation
    fetchVideo
  ])
}
```

### Quick demo

There's a public demo in the github repo, to try this out. Run these commands after checking the code to see it

```
npm run build
cp ./lib/gridintensity.browser.js ./lib/gridintensity.browser.min.js ./public
npx run serve public
```

### Background

We know that the internet runs on electricity. That electricity comes from a mix of energy sources, including wind and solar, nuclear power, biomass, fossil gas, oil and coal and so on,

We call this the _fuel mix_, and this fuel mix can impact on the _carbon intensity_ of your code.

### Move your code through time and space

Because the fuel mix will be different depending when and where you run your code, you can influence the carbon intensity of the code you write by moving it through time and space - either by making it run _when_ the grid is greener, or making it run _where_ it's greener, like a CDN running on green power.

This API is designed to make that easier. It pulls data from open data sources, about the predicted carbon intensity of energy on the grid where code is run, and presents an object you can query, so you can make an application or website serve a different experience to end users based on the carbon intensity.

### TODO

_This is very incomplete. Sorry about that. I hope this gives an idea of where you can help if you're interested._

- [ ] Add support for API providers beyond the UK national grid (Electricity Map would be WONDERFUL)
- [x] Add a 24 hour forward looking check, so there's less need to hit a single API endpoint. This is how forward markets for energy work for reals anyway.
- [ ] Add geo support to either use geolocation features in a browser, or some kind of educated guesses serverside so we use the correct country for grid intensity
- [ ] Write post to explain the idea in more detail
- [ ] Flesh out issues, and guidelines for contribution.
- [ ] Figure out how to get this into the the green web browser extension, to demonstrate how carbon awareness should be part of browsers by default. `user-agents` of change!
- [x] Publish to NPM, and generate the compiled regular js into lib
- [ ] For browsers, include check for the kind of connection on a webpage, using the polyfill currently listed in the package.json
