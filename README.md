
# Grid intensity polyfill

_A polyfill, to build awareness of carbon intensity into javascript programs - move your code through time and space for greener digital products._

###

```js
const gridIntensity = require('gridintensity-polyfill')

// initialise
carbonIntensity = gridIntensity()

if (carbonIntensity.carbonIndex == 'low')  {
  // energy is cheap, the wind is blowing and the sun is out
  // make YAY while the sun is shining

  loadrichImages()

  // we might do this now, instead of later - the cost of energy is low,
  // but the grid is also greener than normal, so the carbon cost is
  // lower too
  await Promise.all([
    doExpensiveOperation(), preLoadVideo()
  ])
} else {
  // eep - our grid is relying on more fossil fuels than usual, so
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


### Background


We know that the internet runs on electricity. That electricity comes from a mix of energy sources, including wind and solar, nuclear power, biomass, fossil gas, oil and coal and so on,

We call this the *fuel mix*, and this fuel mix can impact on the *carbon intensity* of your code.

### Move your code through time and space

Because the fuel mix will be different depending when and where you run your code, you can influence the carbon intensity of the code you write by moving it through time and space - either by making it run *when* the grid is greener, or making it run *where* it's greener, like a CDN running on green power,

This API is designed to make that easier. It pulls data from open APIs about the predicted carbon intensity of energy on the grid where code is run, and presents an object you can query, so you can make an application or website serve a different experience to end users based on the carbon intensity.
