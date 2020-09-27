
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
  const intervalsString = (storage.getItem('gridIntensityData'))

  if (!intervalsString) {
    return []
  }

  // we have no local data - return early
  if (!intervalsString.length) {
    return []
  }
  // if (intervals.data.length < 1) {
  //   return []
  // }


  // console.log(intervals.data)
  // try to parse what we already have
  try {
    parsedIntervals = JSON.parse(intervalsString)
    console.log({ parsedIntervals })
    return parsedIntervals
  } catch (err) {
    // debug(`error, parsing the stored JSON`, err)
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
    now = DateTime.utc();
  }
  // console.debug({ now: now.toISO() })
  // console.debug({ data: this.data.data })
  for (const inter of this.data.data) {
    const until = DateTime.fromISO(inter.to)
    if (until > now) {
      // console.debug({ now: now.toISO() }, { until: until.toISO() })
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
    now = DateTime.utc();
  }

  // this only fetches the last date. If we fetch more dates ahead, we need to
  // find the most closest date in the set to now, as we'd have more than
  // one to choose from

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

  const latestReadingDate = DateTime.fromISO(latestReading.to, { zone: "utc" })
  // console.debug(now.toISO(), latestReadingDate.toISO())


  if (now > latestReadingDate) {
    // console.debug({ timeDiff: Interval.fromDateTimes(latestReadingDate, now).toDuration(['hours', 'minutes', 'seconds']).toObject() })
  } else {
    // console.debug({ timeDiff: Interval.fromDateTimes(now, latestReadingDate).toDuration(['hours', 'minutes', 'seconds']).toObject() })
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
