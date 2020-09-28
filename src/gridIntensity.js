import settings from './defaultSettings'
const intensityProvider = settings.uk

function GridIntensity() {
  this.data = []
  this.intensityProvider = intensityProvider
}


GridIntensity.prototype.setup = async function (localStorage, fetch) {

  this.data = this.getLocalIntensityData()

  if (this.data.length < 1) {
    this.data = await this.fetchIntensityData()
  }
}
GridIntensity.prototype.getLocalIntensityData = function () {

  let storage = this.localStorage
  const intervalsString = (storage.getItem('gridIntensityData'))

  if (!intervalsString) {
    return []
  }

  // we have no local data - return early
  if (!intervalsString.length) {
    return []
  }


  // try to parse what we already have
  try {
    parsedIntervals = JSON.parse(intervalsString)
    console.debug({ parsedIntervals })
    return parsedIntervals
  } catch (err) {
    storage.setItem('gridIntensityData', [])
    return []
  }
}
GridIntensity.prototype.getNextInterval = function (options) {
  // returns very next 30 minute interval from the list of intervals
  // loops forward through the intervals, checking it the time now is
  // greater, and returns the first one to be greater than now, AND less than
  // 31mins ahead too


  let now
  if (options && options.checkDate) {
    now = options.checkDate
  } else {
    now = new Date()
  }
  for (const inter of this.data.data) {

    const until = Date.parse(inter.to)

    if (until > now) {
      return inter
    }
  }
  return null

}


GridIntensity.prototype.getCarbonIndex = async function (options) {
  let now
  if (options && options.checkDate) {
    now = options.checkDate
  } else {
    now = new Date()
  }

  let latestReading
  latestReading = this.getNextInterval({ checkDate: now })
  if (!latestReading) {
    // fetch new data, and try again
    const newIntervals = await this.fetchIntensityData()
    let storage = this.localStorage
    storage.setItem('gridIntensityData', JSON.stringify(newIntervals))
    this.data = newIntervals
    latestReading = this.getNextInterval({ checkDate: now })
  }

  const latestReadingDate = Date.parse(latestReading.to)

  if (now > latestReadingDate) {
    // fetch new data, as this out of date
    this.data = await this.fetchIntensityData()
    latestReading = this.data.data[0]
  }

  return latestReading.intensity.index

}

GridIntensity.prototype.fetchIntensityData = async function () {

  const now = Date()
  const [before, after] = this.intensityProvider.api.forwardLooking.split("{from}")
  const urlString = `${before}${now.toISO()}${after}/`
  let res = await this.fetch(urlString)
  this.data = await res.json()
  return this.data
}

export default GridIntensity
