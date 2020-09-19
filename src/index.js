import debugLib from "debug"
const debug = debugLib("tgwf:gridIntensity")
import fetch from 'cross-fetch';
import settings from './defaultSettings'

const intensityProvider = settings.uk

function GridIntensity() {
  this.data = []
}

function getLocalStoragePolyFill() {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    let localStorage = new LocalStorage('./scratch');
    return localStorage
  } else {
    return localStorage
  }
}

GridIntensity.prototype.setup = async function () {
  let fetchNewData
  this.data = this.getLocalIntensityData()

  if (this.data.length < 1) {
    this.data = await this.fetchIntensityData()
  }
}
GridIntensity.prototype.getLocalIntensityData = function () {
  //  if we're not in a browser, use a localstorage polyfill
  let storage = getLocalStoragePolyFill()

  // otherwise we're in a browser
  const data = storage.getItem('gridIntensityData')

  // we have no local data - return early
  if (data.length < 1) {
    return []
  }
  // try to parsing what we already have
  try {
    parsed_data = JSON.parse(data)
    return parsed_data
  } catch (err) {
    debug(`error, parsing the stored JSON`, err)
    storage.setItem('gridIntensityData', [])
    return []
  }
}

GridIntensity.prototype.getCarbonIndex = async function (options) {
  let now
  if (options && options.checkDate) {
    now = options.checkDate
  } else {
    now = new Date()
  }

  // this only fetches the last date. If we fetch more dates ahead, we need to
  // find the most closest date in the set to now, as we'd have more than
  // one to choose from
  let latestReading = this.data.data[this.data.data.length - 1]
  const latestReadingDate = Date.parse(latestReading.to)

  if (now > latestReadingDate) {
    // fetch new data, as this out of date
    this.data = await this.fetchIntensityData()
    latestReading = this.data.data[0]
  }
  return latestReading.intensity.index

}

GridIntensity.prototype.fetchIntensityData = async function () {
  let res = await fetch(intensityProvider.api.current)
  this.data = await res.json()
  return this.data
}

export { GridIntensity }
