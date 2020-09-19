import debugLib from "debug"
const debug = debugLib("tgwf:gridIntensity")
import fetch from 'cross-fetch';
import settings from './defaultSettings'

// console.log(settings)
const intensityProvider = settings.uk

function GridIntensity() {
  this.data = []
  this.carbonIndex = 'low'
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
    fetchNewData = true
  }




  if (fetchNewData) {
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

GridIntensity.prototype.getCarbonIndex = function () {

}

GridIntensity.prototype.fetchIntensityData = async function () {
  let res = await fetch(intensityProvider.api.current)
  this.data = await res.json()
  // TODO: stash in local storage if available
  return this.data
}

export { GridIntensity }
