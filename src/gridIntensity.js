
// import fetch from 'cross-fetch';
import settings from './defaultSettings'
import { DateTime, Interval } from 'luxon'

const intensityProvider = settings.uk

function GridIntensity() {
  this.data = []
  this.intensityProvider = intensityProvider
}


GridIntensity.prototype.setup = async function (localStorage, fetch) {
  let fetchNewData
  this.data = this.getLocalIntensityData()

  if (this.data.length < 1) {
    this.data = await this.fetchIntensityData()
  }
}
GridIntensity.prototype.getLocalIntensityData = function () {
  //  if we're not in a browser, use a localstorage polyfill
  let storage = this.localStorage

  // otherwise we're in a browser
  const data = storage.getItem('gridIntensityData')
  // we have no local data - return early
  if (!data || data.length < 1) {
    return []
  }
  console.log(data)
  // try to parse what we already have
  try {
    parsed_data = JSON.parse(data)
    console.log(parsed_data)
    return parsed_data
  } catch (err) {
    // debug(`error, parsing the stored JSON`, err)
    storage.setItem('gridIntensityData', [])
    return []
  }
}
GridIntensity.prototype.getNextInterval = function () {
  return this.data.data[this.data.data.length - 1]
}


GridIntensity.prototype.getCarbonIndex = async function (options) {
  let now
  if (options && options.checkDate) {
    now = options.checkDate
  } else {
    now = DateTime.utc();
  }

  // this only fetches the last date. If we fetch more dates ahead, we need to
  // find the most closest date in the set to now, as we'd have more than
  // one to choose from
  let latestReading = this.getNextInteral()
  const latestReadingDate = DateTime.fromISO(latestReading.to, { zone: "utc" })
  console.log(now.toISO(), latestReadingDate.toISO())


  if (now > latestReadingDate) {
    console.log({ timeDiff: Interval.fromDateTimes(latestReadingDate, now).toDuration(['hours', 'minutes', 'seconds']).toObject() })
  } else {
    console.log({ timeDiff: Interval.fromDateTimes(now, latestReadingDate).toDuration(['hours', 'minutes', 'seconds']).toObject() })
  }

  if (now > latestReadingDate) {
    // fetch new data, as this out of date
    this.data = await this.fetchIntensityData()
    latestReading = this.data.data[0]
  }

  return latestReading.intensity.index

}

GridIntensity.prototype.fetchIntensityData = async function () {
  let res = await this.fetch(intensityProvider.api.current)
  this.data = await res.json()
  return this.data
}

export default GridIntensity
